import React from 'react';
import './css/tailwind.css';
import './App.scss';
import { getGeoLocation } from './scripts/geolocation';
import { IAppState, IStatusBoxLoader } from './react-app-env';
import { MapBox } from './components/map/mapbox';
import { getCOVIDSummary } from './scripts/api';
import produce from 'immer';

class App extends React.PureComponent<any, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loadingCovid: false
    }
  }

  componentDidMount() {
    getGeoLocation().then((position: Position) => {
      this.setState({
        position: position });
    }).catch((e) => {
      // Fake position
      this.setState({
        position: {
          coords: {
            latitude: 60.166133,
            longitude: 24.937984,
            accuracy: 10,
            altitude: 10,
            altitudeAccuracy: 10,
            heading: 0,
            speed: 0
          },
          timestamp: Date.now()
        }
      })
      console.log(e);
    });

    this.getCOVIDData();

  }

  getCOVIDData() {
    this.setState(produce((draft: IAppState) => {
      draft.loadingCovid = true;
      if(draft.errors) draft.errors = draft.errors.filter((item) => item.id !== 'covidStats');
    }), () => {
      getCOVIDSummary().then((result) => {
        this.setState({
          loadingCovid: false,
          covidStats: result
        });
      }).catch((error) => {
        if (this.state.errors?.some((item) => item.id === 'covidStats')) return;
        const newErrors = (this.state.errors || []).concat({
          id: 'covidStats',
          timestamp: new Date(),
          retryIn: 10,
          title: "Error occured while loading COVID-19 Statistics. Retrying in {retry}s"
        });
        this.setState({
          errors: newErrors,
          loadingCovid: false
        });
        const retryTimer = setInterval(() => {
          this.setState(produce((draft: IAppState) => {
            if (!draft.errors) return;
            const covidError = draft.errors.filter((error) => error.id === 'covidStats')[0];
            covidError.retryIn--;
          }), () => {
            if(this.state.errors && this.state.errors.filter((error) => error.id === 'covidStats')[0].retryIn <= 0) {
              clearInterval(retryTimer);
              this.getCOVIDData();
            }
          });
        }, 1000);
      });
    });
  }

  render() {
    var loaders: IStatusBoxLoader[] = [];
    if (this.state?.loadingCovid) {
      loaders.push({
        className: "bg-secondary2",
        icon: "autorenew",
        additionalIconClass: "constant-rotation",
        title: "Loading COVID-19 Statistics"
      });
    }
    if (this.state?.errors) {
      const now = new Date();
      for (var i = 0; i < this.state.errors.length; i++) {
        loaders.push({
          className: "bg-secondary2",
          icon: "error",
          title: this.state.errors[i].title.replace("{retry}", this.state.errors[i].retryIn.toString())
        });
      }
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
        <div className="flex justify-center my-16">
            <a href="https://github.com/JoonasKajava/COVID19Tracker"><img className="inline-block h-16" src="./img/GitHub_Logo.png"/><img className="inline-block h-16" src="./img/GitHub-Mark-64px.png"/></a>
        </div>
      </div>
    </>);
  }
}

export default App;
