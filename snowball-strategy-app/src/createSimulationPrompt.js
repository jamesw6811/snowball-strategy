export default function createSimulationPrompt(allSprites, promptSprite) {
    var prompt =  "You are in a snowball fight. ";
    allSprites.forEach((sprite)=>{
      if(sprite.id !== promptSprite.id){
        prompt += createLocationPrompt(sprite, promptSprite) + " ";
      }
    });
    prompt += `You are ${promptSprite.name}. Introduce yourself. 
      Then explain your strategy to win the snowball fight 
      step by step in the style of ${promptSprite.name}.`;
    return prompt;
};

const createLocationPrompt = (viewedSprite, originSprite)=>{
    const dx = viewedSprite.x - originSprite.x;
    // Invert y because our coordinate system is flipped from cardinal directions
    const dy = -(viewedSprite.y - originSprite.y);

    return viewedSprite.name + " is " +
    calculateDistance(dx, dy) + " meters to the " +
    calculateCardinalDirection(dx, dy)+".";
  };

  const calculateDistance = (dx, dy)=>{
    return Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
  }

  const calculateCardinalDirection = (dx, dy)=>{
    const angle = Math.atan2(dy, dx);
    const div16angle = Math.floor(16*angle/(2.0*Math.PI));
    var direction;
    switch (div16angle) { //TODO: change this to an array of directions instead of ugly switch
      case -8:
        direction = "west";
        break;
      case -7:
        direction = "west-southwest"
        break;
      case -6:
        direction = "southwest";
        break;
      case -5:
        direction = "south-southwest"
        break;
      case -4:
        direction = "south";
        break;
      case -3:
        direction = "south-southeast"
        break;
      case -2:
        direction = "southeast";
        break;
      case -1:
        direction = "east-southeast"
        break;
      case 0:
        direction = "east";
        break;
      case 1:
        direction = "east-northeast"
        break;
      case 2:
        direction = "northeast";
        break;
      case 3:
        direction = "north-northeast"
        break;
      case 4:
        direction = "north"
        break;
      case 5:
        direction = "north-northwest"
        break;
      case 6:
        direction = "northwest"
        break;
      case 7:
        direction = "west-northwest"
        break;
      case 8:
        direction = "west"
        break;
      default:
        throw Error("unrecognized angle:"+direction);
    }
    return direction;
  }