import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoute from './routes/users'
import relationshipRoute from './routes/relationship'
import donationRoute from './routes/donations'
import purposesRoute from './routes/purposes'
import adoptadayRoute from './routes/adoptaday'
import ratesRoute from './routes/rates'
import otpRoute from './routes/otp'
import checkoutRoute from './routes/checkout'

const app = express();

const corsOptions = {
  exposedHeaders: ['auth_token']
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;


app.use('/user', userRoute)
app.use('/relationship', relationshipRoute)
app.use('/donation', donationRoute)
app.use('/purposes', purposesRoute)
app.use('/adoptaday', adoptadayRoute)
app.use('/rates', ratesRoute)
app.use('/otp', otpRoute)
app.use('/checkout',checkoutRoute )

function listRoutes(app: any) {
  let route, routes: any = [];
  app._router.stack.forEach(function (middleware: any) {
    if (middleware.route) {
      routes.push(middleware.route);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(function (handler: any) {
        route = handler.route;
        route && routes.push(route);
      });
    }
  });
  return routes;
}

app.get('/', (req, res) => {
  const routes = listRoutes(app);
  const routeList = routes.map((route: any) => {
    return {
      path: route.path,
      method: Object.keys(route.methods).join(', ').toUpperCase()
    };
  });
  res.json(routeList);
});


app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

