import axios from 'axios';

class HistoricalDataHandler {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.apiIP = process.env.REACT_APP_API_URL;
  }

  async addEntry(historicalData) {
    try {
    await axios.post(`${this.apiIP}${this.apiEndpoint}`, historicalData);
    } catch (error) {
      console.error('Error adding historical data:', error);
    }
  }
}

export default HistoricalDataHandler;