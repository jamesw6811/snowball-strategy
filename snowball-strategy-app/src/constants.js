export const ItemTypes = {
    BOARDSPRITE: 'boardsprite',
    PALETTESPRITE: "palettesprite"
  }

export const formatSimulationResult = (spriteName, text)=>{
    return `FROM: ${spriteName}
    RE: snowball fight strategy
    ${text}
      - ${spriteName}`;
  };

export const InfoString = `this web experience simulates the thoughts and strategies of participants in a snow fight

this will almost definitely NOT work on your mobile device. use a desktop browser.

to get started, drag at least 2 images from the palette on the left to the snow arena on the right 
then click the button at the top and wait a bit

Jamie Earl White is responsible for these shenanigans
one simulation costs me about 1 cent. if you like it and have the means, please throw a dollar or nice message my way

venmo @jamieearlwhite and send feedback/words of affirmation to me@jamieearlwhite.com

under the hood, these messages are generated by
  1. programatically creating a structured data prompt, including information about the protagonist, their situation, and the location of people and objects in their environment
  2. feeding this prompt to OpenAI's GPT-3 model API's Completion endpoint
  3. displaying the response in a cute screen

the images were all generated using OpenAI's DALL-E; "let it snow" track by me`;