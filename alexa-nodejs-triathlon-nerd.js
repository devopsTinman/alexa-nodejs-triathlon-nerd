// --------------- Main handler -----------------------
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log('event.session.application.applicationId=${event.session.application.applicationId}');
/      
        if (event.session.application.applicationId !== 'amzn1.ask.skill.f7d98119-728c-418b-827b-4370c64c11ed') {
             callback('Invalid Application ID');
        }
        
        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }
        if (event.request.type === 'LaunchRequest') {
            console.log('Launching');
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            console.log('Intent Request');
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            console.log('Session End Request');
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};



// --------------- Helpers that build all of the responses -----------------------
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}
function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}
// ---------------

// --------------- Data ---------------------------------
var triFacts = 
[
  {
    "name": "Basic",
    "fact": "Triathlon is a multi-sport event involving swimming, cycling and running in succession.",
  },
  {
    "name": "Origin",
    "fact": "Triathlon was first introduced in the 1920s in France",
  },
  {
    "name": "FirstLongDistance",
    "fact": "The first modern long-distance triathlon event was the Hawaiian Ironman Triathlon.",
  },
  {
    "name": "Transition",
    "fact": "The transition from swim to bike is referred to as T1 and that between the bike and run is referred to as T2.",
  },
  {
    "name": "FirstTri",
    "fact": "The first modern swim/bike/run event to be called a triathlon was held at Mission Bay, San Diego, California on September 25, 1974",
  },    
  {
    "name": "ITU",
    "fact": "The International Triathlon Union (ITU) was founded in 1989 as the international governing body of the sport, with the chief goal, at that time, of putting triathlon on the Olympic program",
  },
  {
    "name": "Full",
    "fact": "A full distance triathlon is considered to be a 2.4 mile swim, a 112 mile bike and a 26.2 mile run for a total distance of 140.6 miles",
  },
  {
    "name": "Ultra",
    "fact": "Triathlons longer than full distance are classed as Ultra-triathlons", 
  },
  {
    "name": "Distance",
    "fact": "Triathlons are not necessarily restricted to prescribed distances. Distances can be any combination of distance set by race organizers to meet various distance constraints or to attract a certain type of athlete",
  },
  {
    "name": "Olympic",
    "fact": "The standard Olympic distance of 1.5/40/10 km was created by longtime triathlon race director Jim Curl in the mid-1980s, after he and partner Carl Thomas produced the U.S. Triathlon Series (USTS) between 1982 and 1997",
  },
  {
    "name": "Individual",
    "fact": "Most triathlons are individual events",
  },
  {
    "name": "Error",
    "fact": "The ITU accepts a 5% margin of error in the cycle and run course distances",
  },
  {
    "name": "Start",
    "fact": "In a mass start, all athletes enter the water and begin the competition following a single start signal.",
  },
  {
    "name": "Wave",
    "fact": "In wave start events, smaller groups of athletes begin the race every few minutes",
  },
  {
    "name": "Cycling",
    "fact": "The cycling stage proceeds around a marked course, typically on public roads",
  },
  {
    "name": "Swim",
    "fact": "The swim leg usually proceeds around a series of marked buoys before athletes exit the water near the transition area",
  },
  {
    "name": "Aid",
    "fact": "In most races, aid stations located on the bike and run courses provide water and energy drinks to the athletes as they pass by",
  },
  {
    "name": "Helmet",
    "fact": "One rule involving the cycle leg is that the competitor's helmet must be donned before the competitor mounts (or even takes possession of, in certain jurisdictions[35]) the bike and must remain on until the competitor has dismounted",
  },
  {
    "name": "benefits",
    "fact": "With each sport being an endurance event, training for a triathlon provides cardiovascular exercise benefits.",
  },
  {
    "name": "fitness",
    "fact": "Participants in triathlon often use the sport to improve or maintain their physical fitness",
  },
  {
    "name": "endurance",
    "fact": "There are three components that have been researched to improve endurance sports performance; aerobic capacity, lactate threshold, and economy",
  },
  {
    "name": "hours",
    "fact": "Triathletes spend many hours training for competitions, like other endurance event participants",
  },
  {
    "name": "legs",
    "fact": "Triathletes will often use their legs less vigorously and more carefully than other swimmers, conserving their leg muscles for the cycle and run to follow",
  },
  {
    "name": "openWater",
    "fact": "the majority of triathlons involve open-water (outdoor) swim stages, rather than pools with lane markers",
  },
  {
    "name": "sighting",
    "fact": "open-water swims necessitate sighting: raising the head to look for landmarks or buoys that mark the course",
  },
  {
    "name": "drafting",
    "fact": "Triathlon cycling can differ from most professional bicycle racing depending on whether drafting is allowed during competition",
  },
  {
    "name": "aero",
    "fact": "Triathlon bicycles are generally optimized for aerodynamics, having special handlebars called aero-bars or tri-bars, aerodynamic wheels, and other components",
  },
  {
    "name": "geometry",
    "fact": "Triathlon bikes use a specialized geometry, including a steep seat-tube angle both to improve aerodynamics and to spare muscle groups needed for running",
  },
  {
    "name": "cadence",
    "fact": "At the end of the bike segment, triathletes also often cycle with a higher cadence (revolutions per minute), which serves in part to keep the muscles loose and flexible for running.",
  }
];

// --------------- Events -----------------------
/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}
/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);
// Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

function getWelcomeResponse(callback) {
    /* If we wanted to initialize the session to have some attributes we could add those here.*/
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to Triathlon Nerd facts, you can say: Tell me a triathlon fact' ;
    /* If the user either does not reply to the welcome message or says something that is not understood, they will be prompted again with this text.*/
    const repromptText = 'You can say: Tell me a fact ' ;
    const shouldEndSession = false;
callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);
const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;
// Dispatch to your skill's intent handlers
    if (intentName === 'AMAZON.HelpIntent') {
        console.log('help intent');
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent') {
        console.log('stop intent');
        handleSessionEndRequest(callback);
    } else if (intentName === 'AMAZON.CancelIntent') {
        console.log('cancel intent');
        handleSessionEndRequest(callback);        
    } else if (intentName === 'TriathlonFactIntent') {
        console.log('fact intent');
        getFactResponse(callback);
    } 
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for using the Triathlon Nerd Skill, have a great day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;
callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function getFactResponse(callback) {
    
    //get random index from array of data
    var index = getRandomInt(Object.keys(triFacts).length -1);
    
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    
    //Get card title from data
    const cardTitle = triFacts[index].name;
    
    //Get output from data
    const speechOutput = triFacts[index].fact;
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = '' ;
    const shouldEndSession = false;
callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max - 0 + 1)) + 0;
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}
