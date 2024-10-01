const Notification = ({ message, type }) => {
    if (message === null) {
      return null;
    }
  
    const style = {
      color: message.type === 'alert' ? 'red' : 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    };
  
    return <div style={style}>{message.msg}</div>;
  };
  
  export default Notification