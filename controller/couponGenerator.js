function generateCouponCode() {
      let length = 10;
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let couponCode = '';
    
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        couponCode += characters.charAt(randomIndex);
      }
    
      return "BOOKWORM"+couponCode;
    }
    
    module.exports = generateCouponCode;