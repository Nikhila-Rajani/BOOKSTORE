const generateDate = () => {
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; 
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      console.log('the date is ',formattedDate)
      return formattedDate;
  }
  
  module.exports = generateDate;