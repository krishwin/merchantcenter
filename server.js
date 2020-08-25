require('isomorphic-fetch');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const jwt =require('jsonwebtoken');
dotenv.config();
const fs = require('fs');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;
const  privateKey = fs.readFileSync('keys/rsa.private');

app.prepare().then(() => {
  const server = new Koa();
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
	  scopes: ['read_products','read_customers','write_customers','read_orders','read_discounts','write_discounts','read_price_rules','write_price_rules'],
	  accessMode: 'offline',
      async afterAuth(ctx) {
		const { shop, accessToken,accessTokenData } = ctx.session;
		let storeid = -1;
	console.log(accessToken);
	      if(accessToken.associated_user)
		{
			const response =  await fetch(
        'https://irad6avdaqvzwto-subscriberdb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/restsub/parties/?p_cust_email='+accessTokenData.associated_user.email+'&p_cust_store='+shop,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': session.accessToken,
				  },
				},
			  );
		
			let merchcontacts = await response.json();
			console.log(merchcontacts);

			if(merchcontacts.customer_contacts && merchcontacts.customer_contacts.length > 0 )
			{
				console.log('customer exists'+ merchcontacts.customer_contacts[0].CONTACT_ID);
			}
			else{
				console.log('creating merchant contact');
				let payload = JSON.parse(JSON.stringify(accessTokenData));
				payload.store_name = shop;
				console.log(JSON.stringify(payload));

				const response =  await fetch(
					'https://irad6avdaqvzwto-subscriberdb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/restsub/parties/',
					{
					  method: 'POST',
					  body: JSON.stringify(payload),
					  headers: {
						'Content-Type': 'application/json',
						'X-Shopify-Access-Token': session.accessToken,
							  },
							},
						  );
				if (!response.ok)
					console.log(await response.text());
				else
					console.log(await response.json());
			}
		}else
		{
			const response =  await fetch(
				'https://irad6avdaqvzwto-subscriberdb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/restsub/parties/'+shop,
				{
				  method: 'GET',
				  headers: {
					'Content-Type': 'application/json',
					'X-Shopify-Access-Token': session.accessToken,
						  },
						},
					  );
				
					let merchcontacts = await response.json();
					console.log(merchcontacts);
					
			if(merchcontacts.customer && merchcontacts.customer.length > 0 )
			{
				console.log('customer exists'+ merchcontacts.customer[0].STORE_ID);
				storeid= merchcontacts.customer[0].STORE_ID;
			}
			else{
				console.log('creating merchant ');
				let payload = JSON.parse(JSON.stringify(accessTokenData));
				payload.store_name = shop;
				payload.accessToken = accessToken;
				console.log(JSON.stringify(payload));

				const response =  await fetch(
					'https://irad6avdaqvzwto-subscriberdb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/restsub/parties/',
					{
					  method: 'PUT',
					  body: JSON.stringify(payload),
					  headers: {
						'Content-Type': 'application/json',
						'X-Shopify-Access-Token': session.accessToken,
							  },
							},
						  );
				if (!response.ok)
					console.log(await response.text());
				else
					console.log(await response.json());
			}
		}
		
		let token =jwt.sign({shop:shop},privateKey, { algorithm: 'RS256' , expiresIn: '1h' ,audience:'subscribenow',issuer: 'subscribenow',keyid : 'master'})
	      ctx.cookies.set("shopOrigin", shop, {
          					httpOnly: false,
         					 secure: true,
         					 sameSite: 'none'
									});
		ctx.cookies.set("token", token, {
										httpOnly: false,
										secure: true,
										sameSite: 'none'
											  });
		ctx.cookies.set("shopid", storeid, {
          					httpOnly: false,
         					 secure: true,
         					 sameSite: 'none'
									});											  
        ctx.redirect('/');
      },
    }),
  );

  
  

  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;

  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
