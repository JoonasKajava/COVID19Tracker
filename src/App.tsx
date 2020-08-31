import React from 'react';
import './css/tailwind.css';
import './App.scss';
import { getGeoLocation, reverseGeocoding } from './scripts/geolocation';
import { IAppState, IGeocodingFeature } from './react-app-env';
import { MapBox } from './components/map/mapbox';
import { getCOVIDSummary } from './scripts/api';

class App extends React.PureComponent<any, IAppState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    getGeoLocation().then((position: Position) => {
      this.setState({
        position: position
      });
    }).catch((e) => {
      console.log(e);
    });

    getCOVIDSummary().then((result) => {
      const countries = result.Countries.map((item) => item.CountryCode);
      let i, j, chunk = 20;
      let geoData: IGeocodingFeature[] = [];
      for (i = 0, j = countries.length; i < j; i += chunk) {
        let temp = countries.slice(i, i + chunk);
        reverseGeocoding(temp, ['country']).then((countries) => {
          geoData = geoData.concat(countries.features);

        })
      }
    });
  }

  render() {
    return (<>
      <div className="container">
        {this.state?.position && <MapBox
          longitude={this.state.position.coords.longitude}
          latitude={this.state.position.coords.latitude}
          zoom={12}
        />}
      </div>
    </>);
  }
}

export default App;
