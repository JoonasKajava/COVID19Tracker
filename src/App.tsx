import React from 'react';
import './css/tailwind.css';
import './App.scss';
import { getGeoLocation } from './scripts/geolocation';
import { IAppState, IStatusBoxLoader } from './react-app-env';
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

    this.setState({
      loadingCovid: true
    }, () => {
      getCOVIDSummary().then((result) => {
        this.setState({
          loadingCovid: false,
          covidStats: result
        });
      });
    });

  }

  render() {
    var loaders: IStatusBoxLoader[] = [];
    if(this.state?.loadingCovid) {
      loaders.push({
        className:"bg-secondary2",
        icon: "autorenew",
        additionalIconClass: "constant-rotation",
        title: "Loading COVID-19 Statistics"
      });
    }
    return (<>
      <div className="container">
        {this.state?.position && <MapBox
          longitude={this.state.position.coords.longitude}
          latitude={this.state.position.coords.latitude}
          zoom={12}
          loaders={loaders}
          covidStats={this.state.covidStats}
        />}
      </div>
    </>);
  }
}

export default App;
