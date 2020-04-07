
# Timemap and custom Mapbox maps

You can use custom satellite images and maps from [https://www.mapbox.com/](https://www.mapbox.com/) to customise the map in Timemap. Sign up for an account at [https://www.mapbox.com/](https://www.mapbox.com/) and use Mapbox's studio to create a custom map. To use the map you need to configure Timemap with the following: 

## Token

To access your Mapbox account Time Map needs an access token that you create under your Mapbox account. 

Sign in to Mapbox and then navigate to: 

Account > Access Tokens 

* Create a Token - add a token and optionally restrict it to the url of your timemap instance.
* Add it to Timemap - copy the token and then add it to Timemap's `config.js` at the top level

 ```
  MAPBOX_TOKEN: 'mapbox_token',
 ```

Timemap can now access your account but you need to associate any maps you want to use in Timemap with that account using Mapbox Studio. Once you have done that you can reference the Mapbox Map id in Timemap's `config.js`

## Mapbox Map Id

To reference a map you have created in Mapbox you need the map's id which is available under it's share > 

* Style URL - which looks like this: `mapbox://styles/your-account-name/x5678-map-id`

Once you have that go back to `config.js` and under the UI settings add: 

```
   ui: {
      tiles: 'your-account-name/x5678-map-id',
``` 

