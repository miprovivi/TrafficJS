var wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function move(id,sceneId) {
    const busResponse = await fetch('/data/trafficData/traffic.json'); 
    vehicle = await busResponse.json(); 

    
    //console.log(scenes);
    if(document.getElementById("busesScript") === null){
        const response = await fetch('/data/trafficData/scenes.json'); 
        scenes = await response.json(); 
    } else {
        scenes = JSON.parse(document.getElementById("busesScript").textContent);
    }

    for (let i = 0; i < scenes.length; i++) {
        if(sceneId == scenes[i].id){
            console.log("yay found");
            sceneId = i;
            break;
        }
        
    }

    var c = document.getElementById(id);
    var ctx = c.getContext("2d");

    if (scenes[sceneId].width == "FULL") {
        c.width = window.innerWidth;
    } else {
        c.width = scenes[sceneId].width;
    }

    
    


    while(true ) {
        let img = new Image();

        if (scenes[sceneId].Type == "All") {
            var i = Math.floor(Math.random()*vehicle.length);
        } else if (scenes[sceneId].Type == "One") {
            var i = scenes[sceneId].VehicleId;
        } else {
            do {
                var i = Math.floor(Math.random()*vehicle.length);
            } while (scenes[sceneId].Type != vehicle[i].Type);
        }           
        

        img.src = vehicle[i].File;
        img.onload = () => resolve(img);
        var name = vehicle[i].Name;
        var speed = vehicle[i].Speed;
        for (let i = -10; i < c.width+img.width; i++){
            ctx.drawImage(img, i-img.width,75-img.height,img.width,img.height);
            await wait(1000/(speed*scenes[sceneId].SpeedMultiplier));
            ctx.clearRect(i-1-img.width, 75-img.height, img.width, img.height);
            ctx.clearRect(0,0, ctx.width, ctx.height);
            ctx.font = "20px pixel";
            if(scenes[sceneId].Title){
                ctx.fillText(name,5,15 );
            }
           

        }
        ctx.clearRect(0,0, 3000, 3000);
        if(scenes[sceneId].Delai == "Fixed"){
            await wait(scenes[sceneId].DelaiTime[0]);
        }
        if(scenes[sceneId].Delai == "Random"){
            await wait(scenes[sceneId].DelaiTime[0] + Math.floor(Math.random()*(scenes[sceneId].DelaiTime[1] - scenes[sceneId].DelaiTime[0])));
        }
        
        
        
    }
}



async function init() {

    console.log("init");
    
    var allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
    console.log(allIds);

    for (let i = 0; i < allIds.length; i++) {
        if (allIds[i].startsWith("traffic")) {
            var b = document.getElementById(allIds[i]);
            var btx = b.getContext("2d");
            console.log(allIds[i]);
            move(allIds[i],allIds[i].slice(7,allIds[i].length));
        }
    
    }
}

init();

