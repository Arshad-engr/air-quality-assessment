import React, { useState } from 'react';
import { Container, Form, Button, Message,Table,Icon  } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


const API_URL = 'https://api.openaq.org/v1/measurements';
const AirIcon = () => <Icon  name='tree' />

const App = () => {
  const [location1, setlocation1] = useState('');
  const [location2, setlocation2] = useState('');
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

 

  const handleLocation1Change = (e) => {
    setlocation1(e.target.value);
  };

  const handleLocation2Change = (e) => {
    setlocation2(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
      const response = await fetchData(location1,"City1");
      const response2 = await fetchData(location2,"City2");
      let responseOneArray = [];
      let responseTwoArray = [];
     if(response){
           const objectArray = [{ location: response.results[0].location }, { value: response.results[0].value }, { unit: response.results[0].unit }];
           responseOneArray.push(objectArray);
          
     }
     if(response2){
           const objectArray = [{ location: response2.results[0].location }, { value: response2.results[0].value }, { unit: response2.results[0].unit }];
           responseTwoArray.push(objectArray);
          
     }
     const mergedArray = [...responseOneArray, ...responseTwoArray];
     setResults(mergedArray);
     if(mergedArray.length < 1){
      if(responseTwoArray.length < 1){
        setError(`No data found`);
       }
     }
  }; 

  const fetchData = async (location, city) => {
    const response = await fetch(`${API_URL}?location=${location}&limit=1`);
    if (!response.ok) {
      // Handle the error if the response status is not in the 200-299 range
      const errorMessage = `Request failed with status code ${response.status}`;
      setError(errorMessage);
      // throw new Error(errorMessage);
      return 0;
    }
    const jsonData = await response.json();
    if(jsonData.results.length > 0){
      return jsonData;
    }else{
      return 0;
    }
    
  };
  



  return (
    <Container style={{ width: '700px',margin:'20px' }}>
      <Form onSubmit={handleSubmit} error={error !== null} widths='equal' >
        <Form.Group >
          <Form.Input  fluid label='City 1' placeholder='Enter City 1' value={location1} onChange={handleLocation1Change} />
          <Form.Input  fluid label='City 2' placeholder='Enter City 2' value={location2} onChange={handleLocation2Change} />
        </Form.Group>
        <div class="ui one column stackable center aligned page grid">
          <div class="column twelve wide">
          <Button verticalAlign="middle" disabled={!location1 || !location2 ? true:false} centered primary type="submit">
              Compare Air Quality
          </Button>
          </div>
        </div>
            <Message error content={error} />
            {results.length > 0 && (
            <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell> <AirIcon  /></Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
                <Table.HeaderCell>Unit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {results.map((item,index) => (
                  <Table.Row key={index}>
                    <Table.Cell style={{background:'#f9fafb'}} collapsing>{item[0].location}</Table.Cell>
                    <Table.Cell>{item[1].value}</Table.Cell>
                    <Table.Cell>{item[2].unit}</Table.Cell>
                  </Table.Row>
                 ))}
            </Table.Body>
          </Table>
           )}
     </Form>
    </Container>
  );
};

export default App;
