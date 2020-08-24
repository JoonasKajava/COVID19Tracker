import React from 'react';
import './css/tailwind.css';
import './App.css';
import { getGeoLocation } from './scripts/geolocation';
import { IAppState } from './react-app-env';
import { MapBox } from './components/map/mapbox';

class App extends React.PureComponent<any, IAppState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    getGeoLocation().then((position: Position) => {
      console.log(position);
      this.setState({
        position: position
      });
    }).catch((e) => {
      console.log(e);
    });
  }

  render() {
    return (<>
      <h1>Initial {Date.now()}</h1>
      <div className="container">
        {this.state?.position && <MapBox
          longitude={this.state.position.coords.longitude}
          latitude={this.state.position.coords.latitude}
          zoom={2}
        />}
      </div>
    </>);
  }
}

export default App;
