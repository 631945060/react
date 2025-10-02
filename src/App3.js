import './index.css'
const style = {
  color: 'red',
  fontSize: '24px',
}

function App() {
  return (
    <div className="App">
      <span style={style}>Hello World</span>
      <span className="foo">Hello World1</span>
    </div>
  );
}

export default App;