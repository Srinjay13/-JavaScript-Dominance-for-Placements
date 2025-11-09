// Chapter 1 : Design Patterns in JS

//Module Patter :
/* Module pattern ek design pattern hai jisme hum apna code ek self executing function (IIFE) ke andaar likhte hai, taaki variables aur functions private rahen
Iske andaar se hum sirf wahi cheezein return karte hai jo bahar use karni hai hume hi. Iss pattern ka fyada hai: Data Hiding  (Encapsulation) aur clean structure, taaki code secure, reusable aur manageable ban sake
Hamlog IIFE ke andaar jo kuch bhi banate hai wo bahar access nhi kar sakte hai but uske andaar se ek object return kara sakte hai and usmein se wo cheezein se kaam kar sakte hai
*/

let Bank = (function(){
    let bankBalance = 57000; //This variable is entirely private to this IIFE and will not even known by the outer world that there is this, this is Abstraction

    function checkBalance(){
        console.log(bankBalance);
    }
    function addBalance(val){
        bankBalance += val;
        console.log("Updated Balance"+bankBalance);
    }
    function withdraw(val){
        bankBalance -= val;
        console.log("Remaining Balance : "+bankBalance);
    }
    return {
        checkBalance,
        addBalance,
        withdraw
    };
})();

Bank.withdraw(5000); //Remaining Balance : 52000

// Review Module pattern mein baas ek hi alag cheez hota hai that is ki jab hamlog return kar rhe hai toh wo functions ya variables ka naam alag deke bhej sakta hu and then bahar mein usse access karte waqt bhi yahi naam use karna parega haame like :
// return {
//     check : checkBalance,
//     add : addBalance,
//     draw : withdraw,
// }

// Factory Function Pattern 
/* Ek function banate ho jo objects create karta hai (factory = object banane ki machine)
Ye pattern ek aisa design pattern hai jisme hum ek simple function likhte hain jo naaye objects banakar return karta hai, bina class ya new keywords use kiye
Har baar jab tum factory call karte ho, tumhe ek naya object milta hai jisme apne methods aur (agar chaho to) private data ho sakta hai 
Ye pattern specially useful hai jab tumhe ek hi type ke bohot saare objects chaiye, jaise users,products,tasks*/

function createProduct(name, price){
    let stock = 10;
    return {
        name,
        price,
        checkStock(){
            console.log(stock);
        },
        buy(qty){
            if(qty <= stock){
                stock -= qty;
                console.log(`${qty} pieces bought, ${stock} number of pieces still left.`);
            } else{
                console.error("We only have "+stock+" pieces left !");
            }
        },
        refill(qty){
            stock +=qty;
            console.log("Reffiled the Stock. Now "+stock+" no. of pieces.");
        }
    }
}
let iphone = createProduct("iphone",100000); //separate product maintaing its balance of stock left
let kitkat = createProduct("kitkat",50); //altogether different product maintaing its balance separately

//Observer Pattern (Basic Pub-Sub model)

class YoutubeChannel{
    constructor(){
        this.subscribers = [];
    }

    subscribe(user){
        this.subscribers.push(user);
        user.update("You have subscribed the channel");
    }
    unsubscribe(user){
        this.subscribers = this.subscribers.filter((sub) => sub !== user);
        user.update("you have unsubsribed the channel !");
    }
    notify(msg){
        this.subscribers.forEach((sub) => sub.update(msg));
    }
}

class User{
    constructor(name){
        this.name=name;
    }
    update(data){
        console.log(this.name+", "+data);
    }
}

let sheriyans = new YoutubeChannel();
let user1 = new User("Srinjay Saha");
let user2 = new User("Moumita Paul");
sheriyans.subscribe(user1);
sheriyans.subscribe(user2);
sheriyans.notify("New video is out on the channel, go watch it now !");

//Chapter 2 : Perfomance Optimization

//DEBOUNCING v/s THROTTLING
//Deboucing -> ap koi action kar rhe ho and aap ye nahi chahte har action pe kuchh ho, jab bhi mere actions ke beech mein koi specific gap ajaye toh fir reaction perfrom ho

//Jab ham log koi bhi function ke aage () ye laga dete hai toh JS jab bhi code ko read kar rha hoga tab hi wo function chal jayega rather than baad mein

let input = document.querySelector("input");

function debounce(fnc,delay){
    let timer;//taaki jab bhi input ho toh ye reset hojai
    return function(...args){
        clearTimeout(timer);
        timer = setTimeout(() =>{
            fnc(...args);
        },delay);
    };
}

input.addEventListener("input",debounce(function(){
    console.log("Ran 1 time, that is he took a delay or pause !");
},1000));

// so basically jab bhi input hoga, toh practically tab debounce(...) nahi chal rha hai rather jo function debounce return karta hai wo cheez yaha pe ajayega addEventListener ke bagal waale function mein, kyuuuuuuuuuuuu? Kyuki jab pehli baar code initialize hua tha tab kya hua ki func ke bagal mein () tha toh debounce chal gya tha turaant, toh ab hamlog kya karte hai ki ek delay bhejte hai jiske lie wo ek tineout function chalayega everytime koi bhi input ho, kyuuuuuuuuuuu? kyuki EventListener pe wo func hi chalta hai, so timer = undefined hojayega jab bhi kuch naya input ho islie jab bhi delay hoga toh timer naya se start hoga, ab samjhe ? achaaaaaaaaa....hmmmmmmmmmmmm, but ek cheez batao ye ...args kya hai aur kyu lie hai, wo tum yaad karo ki jab bhi hamlog EventListener likhte hai toh haame ek dets karke milta tha, toh wo cheez wahi hai, and since uska length kitna hoga, ye nahi pata toh islie ...args karke pass kar rhe hai and agar niche function eventListener waale mein agar uss dets se kuch nikaalna ho, toh nikal sakte hai, for example kya type kia, wo hamlog waha se nikal sakte hai

// Basically debounce kya hai ki ek delay hamlog batayenge ,and utna delay ke baad jaab bhi ayega action ka reaction tab hi milega

//But throttle mein kya hota ki ek interval par chalunga, action agar hota rha and apne ek interval bataye toh utne interval mein always apka event chalega hi chalega

function throttle(fnc,delay){
    let timer = 0;
    return function(...args){
        let now = Date.now();
        if(now - timer >=delay){
            timer = now;
            fnc(...args);
        }
    };
}

// input.addEventListener("input",throttle(function(){
//     console.log("Ran 1 time, that is he took a delay or pause !");
// },1000));

//LAZY LOADING IMAGES (with IntersectionObserver)
// Assan bhasa mein bole toh socho hamare website mein bohot saare images hai and high resolution waale,toh agar ham saare images ko render karne jayenge pehle hi toh boht time le lega and slow render bhi hoga page, toh user exp acha nahi hoga, isko hatane ke lie hamlog ye cheez karte hai. Isme kya hota hai ki pehle se koi bhi images loaded nahi rahega that is src nahi rakhenge and basic images ka "OPACITY:0" rakhenge, taaki pehle na deke aur jab bhi wo screen mein aye toh wo load hoke ajaye and hamara image bhi tab hi download ho

let imgs = document.querySelectorAll("img");

const observer = new IntersectionObserver(function(entries,observer){
    entries.forEach(function(entry){
        if(entry.isIntersecting){
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add("loaded");
            observer.unobserve(observer);
        }
    })
},
{
    root : null,
    threshold: 0.1,
}
);

imgs.forEach(function(img){
    observer.observe(img);
});

//Toh deko bhai yaha pe kaise kaam hota hai, hamlog ek InteresectionObserver bol ke ek API hai uska ek object banake ek function pass kar deta hu isme, jo do cheezein leti hai, ek is entries(jo entry hamlog pass karenge isko) and next is ye observer khud taaki usko last mein unobserve kar paye...
// Ab har entries jo milega usko ek ek karke lopop karenge and ek ek entry ko pehle check karenge ki wo kya intersecting hai screen ke saath and agar hua toh img ko layenge from entry.target; then img kaa SRC toh khali tha, and hamlog HTML mein "data-src" karke kie the kaam, toh usko use karne ke lie JS mein hamlog dataset.<> jo bhi data-<> ke baad likhe the usse access kar sakte hai, then classlist mein "loaded" bolke ek class define karke rakhenge CSS mein jisko just add kar denge, jisme bas wo opacity ko 1 kia hua hoga, taaki wo screen mein ajaye, and last mein bas uss entry ko unobserver kar denge using the same "observer" variable and ye jo function mein ye sab kar rhe the iske bahar hamlog ko ek object bhi return karna hota hai jisme hamlog ye bataye ki root kya hai, matlab konsa area mein hamlog eye rakhenge, agar "NULL" hai toh ye poora screen hota hai but agar isme hamlog koi bhi div wagera dena chaiye toh wo pass kar sakte hai yaha pe, and threshold 0.1 matlab ki jab bhi wo image 10% uss area main aajayega tab hi hamlog usse load kar lenge

// CODE SPLITTING

//Iska basic matlab yaahi hai ki socho hame pata hai ki hamara JS bohot hi baara file hai toh ham kya kar sakte hai ki haam apne JS file ko split kar de, matlab ki jo ek heavy function ya kuch features ko separate out kar de and usko ek alag JS file mein rakh de, and jab bhi haame lage ya kuch change ho jo required hai uss feature ke lie toh usko load kar lu

const btn = document.querySelector("button");
btn.addEventListener("click", async function(){
    let heavy = await import("./heavy.js");
    heavy.veryHeavy();
});

// Toh deko dost iske lie do tin cheezein ka kheyal rakhna parega,1st is ki hamara script jo load karenge HTML mein usme ek tag add karna hoga that is "type="module"" and then jo alag file hai heavy.js usme jo kuch bhi hamlog export bolke likhenge wo kisi aur file se hamlog usse import kar payenge

//Next cheez jo script.js main hamlog ka event hoga jispe hamlog ko usko load karna hai, waha pe yaad rakhna hame ye function async aur await mode pe chalana hoga taaki jab tak wo file import na hojaye tab taak haame nahi chalane code ko aage, toh import hone ke baad usme ek object mein ajayega and uska wo function ko dot deke chala sakte hai jab bhi ham hamare script.js mein chaiye

//AVOID UNNECESSARY REFLOWS and REPAINTS

//Asaan bhasa mein baar baar DOM ko reload karna achi cheez nahi hai usse User Experience bura hota hai
//Isi problem ko solve karne ke lie "REACT" ka janam bhi hua tha, that is jab bhi kuch changes ho hamare page ka koi ek section mein toh pura DOM ko reload karke page ko refresh nahi karna hoga and alag alag components mein tor sakte hai 

const space = document.createDocumentFragment();
//Creates a new empty DocumentFragment into which DOM nodes can be added to build an offscreen DOM tree, isse kya hota hai, ki jab bhi socho hamare paas boht saare elements hai ek ul ke andaar li's mein toh usko pehle space mein load kar sakte hai append karke then last mein DOM mein eksath load kar sakte to avoid page ko bar bar reload karna jab har ek li add ho using a for loop shayad

//MEMORY LEAKS : TIMERS and EVENT LISTENERS

//Jab bhi hamlog kuch setInterval mein chalate hai for example toh wo chalta hi rehta hai even when we think it's over doing it's task if we don't stop
let counter = 0;
const inter = setInterval(()=>{
    if(counter<10){
        counter++;
        console.log(counter);
    }else{
        clearInterval(inter); //Isse wo clear hojayega and piche nahi chalte rahega always
        console.log("Abhi bhi chaal raha hai...");
    }
},500);

//Hamlog sochenge ki ye 500ms ke interval mein 1 se 10 taak print hoge tham gya kyuki kuch print nhi ho rha hai but at the reality ye piche chalte hi rahega

// SEPARATION OF CONCERNS (DOM v/s LOGIC)
const button = document.querySelector("button");
const ul=document.querySelector("ul");

function add(num1,num2){
    return num1+num2;
}

button.addEventListener("click",function(){
    const n1=Math.floor(Math.random()*10);
    const n2=Math.floor(Math.random()*10);
    let solution = add(n1,n2);
    //Isse kya hoga ki Separation of concern kar denge, i.e. hamara DOM ka kam alag se horha hai and hamara logic ek alag se handle horha hai toh samajhne mein baad mein easy hoga
    let li = document.createElement("li");
    li.textContent=solution;
    ul.appendChild(li);
});

//CUSTOM UTILITIES

//Let's say map function agar nahi hota toh hamlog khud ke lie bhi create kar sakte hai, toh chalo dekte hai

//Map function : Ek array ke top pe chalta hai and us array ke sabhi members us map function ke andar aate hai and map function ek naya array return krta hai and us naye array mein jo bhi map ne return kiya hoga wahi placed hota hai
const arr = [1,2,3,4,5];
function myMap(arr,callback){
    let newarr=[];
    for(let i=0;i<arr.length;i++){
        newarr.push(callback(arr[i],i,arr));
    }
    return newarr;
}

let ans = myMap(arr,function(val){
    return val+2;
});

// HOW JS ACTUALLY WORKS ON BROWSER : CALL STACK

// JS Single-threaded hai : ek time par ek hi kaam karta hai, jab tum function call karte ho to wo stack ke top pe chala jata hai and Function complete hone ke baad stack se nikaa; jata hai(pop jo hota hai)

/*
🌐 What Are Web APIs? (Simple Definition)
Web APIs are built-in tools provided by the browser that let your JavaScript code interact with the browser or the web.

🧠 In short:
They are like ready-made features or services that browsers give you —
so you don’t have to build everything from scratch.
💬 Think of it Like This:
When you’re using JavaScript in a browser, you’re not just running plain JS —
you’re actually talking to the browser itself.

And the browser says:
“Hey JS, if you need to fetch data, store something, show an alert, or play a sound —
I’ve got APIs for that!”

🧠 1️⃣ What Is the Event Loop?
The Event Loop is the mechanism that makes JavaScript handle asynchronous code — even though JS itself is single-threaded.

In simple words:
It allows JavaScript to do many things at once (like waiting for a fetch, user clicks, or timers)
without blocking the rest of your code.

⚙️ 2️⃣ The Core Components
Let’s break down how it actually works:
| Part               | What It Does                                                  | Example                                   |
| ------------------ | ------------------------------------------------------------- | ----------------------------------------- |
| **Call Stack**     | Where JS runs code line by line                               | `console.log("Hi")`                       |
| **Web APIs**       | Browser features that handle async tasks                      | `setTimeout`, `fetch`, `addEventListener` |
| **Callback Queue** | Stores finished async tasks waiting to run                    | Timer finished, fetch completed           |
| **Event Loop**     | Keeps checking: “Is the stack empty? Then run next callback.” | Manages the flow                          |

            ┌──────────────────────┐
            │      Web APIs        │
            │ (setTimeout, fetch)  │
            └─────────┬────────────┘
                      │
                      ▼
┌────────────┐   ┌────────────┐   ┌────────────┐
│ Call Stack │ ← │ Event Loop │ ← │ Callback Q │
└────────────┘   └────────────┘   └────────────┘
🌀 The Event Loop keeps checking:

“Is the Call Stack empty? If yes, move the next callback from the Queue into the Stack.”

⚡ 3️⃣ Example — Synchronous vs Asynchronous */
console.log("1️⃣ Start");

setTimeout(() => {
  console.log("2️⃣ Timer finished");
}, 2000);

console.log("3️⃣ End");
/*
💬 Output:
1️⃣ Start
3️⃣ End
2️⃣ Timer finished

🧠 Why not in order?
JS runs synchronously → executes line 1 and 3 immediately
setTimeout is handed off to Web API → runs the timer in background
After 2s, it moves the callback into the Callback Queue

Event Loop waits until the stack is empty,
then pushes the callback → executes it → prints “2️⃣ Timer finished”

🕹️ 4️⃣ Microtasks vs Macrotasks (Advanced but Important)

There are two queues:
Macrotask queue: for setTimeout, setInterval, setImmediate
Microtask queue: for Promises, queueMicrotask, process.nextTick

The Event Loop always runs microtasks first before macrotasks.
🧩 Example: */
console.log("Start");

setTimeout(() => console.log("Timeout"), 0);

Promise.resolve().then(() => console.log("Promise"));

console.log("End");
/*💬 Output:
Start
End
Promise
Timeout


🧠 Explanation:
Promise.then() → goes to microtask queue
setTimeout() → goes to macrotask queue
Event loop first empties microtasks → runs “Promise”
Then goes to macrotasks → runs “Timeout”

🧩 5️⃣ Example with Fetch (Real Async Example): */
console.log("Fetching...");

fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(() => console.log("Fetch done"))
  .catch(() => console.log("Error!"));

console.log("Continue other work...");

/*💬 Output:
Fetching...
Continue other work...
Fetch done

🧠 Why?
Fetch runs asynchronously (browser handles it)
JS doesn’t wait — it continues running the next line
When fetch completes, its .then() callback goes to microtask queue
Event Loop runs it after the stack is clear*/
