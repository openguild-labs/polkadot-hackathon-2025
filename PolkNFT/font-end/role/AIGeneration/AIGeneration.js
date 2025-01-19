const axios = require("axios");

function NFTGeneration(prompt) {
   const options = {
      method: "POST",
      url: "https://api.edenai.run/v2/image/generation",
      headers: {
         authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY_GENIMG}`,
      },
      data: {
         providers: "amazon", //stabilityai
         text: prompt,
         resolution: "512x512", // change to 1024 if using stabilityai because it only supports 1024
         fallback_providers: "",
         num_images: 3, // replicate only supports generating 1 images but stability can generate 3
      },
   };

   return axios
      .request(options)
      .then((response) => {
         console.log(response);
         const imageUrls = response.data?.amazon?.items?.map(
            (item) => item.image_resource_url,
         );
         // const imageUrls = response.data?.stability?.items?.map(item => item.image_resource_url);
         return imageUrls;
      })
      .catch((error) => {
         console.error(error);
      });
}

export default NFTGeneration;
