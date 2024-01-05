export default class UIManager {
  constructor () {
    this.records = [];
    this.journalSelected = null; 

    let leftSidebar = document.querySelector("#sidebar-left");
    leftSidebar.addEventListener("click", function (event) {
      fishInTank.forEach(fish => {
        if (fish.selected) {
          this.updateSelected(fish, false); 
        }
      });
    }.bind(this)); 
    
    let recordsSidebar = document.querySelector("#sidebar-right");
    recordsSidebar.addEventListener("click", function (event) {
      let recordClicked = event.target.closest(".record");
      if (!recordClicked) {
        fishInTank.forEach(fish => {
          if (fish.selected) {
            this.updateSelected(fish, false); 
          }
        });
      }
    }.bind(this));

    let btn = document.querySelector('#music-button');
    btn.addEventListener("click", this.toggleMusic); 
  }
  
  updateSelected(fish, value) {
    fish.selected = value;
    this.updateFishInfo(); 
  }

  updateFishInfo() {
    // Update the UI
    let selectedFish = fishInTank.filter(fish => fish.selected);
    let selectedFishDiv = document.querySelector("#selected-fish");
    selectedFishDiv.innerHTML = "";

    if (!selectedFish.length) {
      selectedFishDiv.innerHTML = "<p><i>No fish selected.</i></p>";
      return; 
    }
    
    selectedFish.forEach(fish => {
      // Construct the new element
      let fishDiv = document.createElement("div");
      fishDiv.classList.add("fishinfo"); 
      
      let fishImage = document.createElement("img");
      fishImage.src = `assets/fish/fish${fish.type}.png`;
      
      // Create paragraphs for the name and personality
      let fishInfo = document.createElement("div");
      fishInfo.innerHTML = `<b>Name: </b><span style='color: ${fish.favoriteColor}'>${fish.name}</span>`;
      fishInfo.innerHTML += `<br><b>Mood: </b>${fish.mood}`;
      fishInfo.innerHTML += `<br /><b>Favorite food: </b>${fish.favoriteFood}`;

      fishDiv.appendChild(fishImage);
      fishDiv.appendChild(fishInfo);
      
      // Add it to the selected fish div
      selectedFishDiv.appendChild(fishDiv); 
    });
  }

  createFishJournal() {
    let listDiv = document.querySelector("#fish-list");
    fishInTank
      .toSorted((a, b) => a.name.localeCompare(b.name))
      .forEach((fish) => {
        let fishDiv = document.createElement("div");
        fishDiv.classList.add("fish");
        fishDiv.classList.add(`${fish.name}${fish.favoriteFood}${fish.type}`);

        let fishImage = document.createElement("img");
        fishImage.src = `assets/fish/fish${fish.type}.png`;
        
        let fishInfo = document.createElement("div");
        fishInfo.innerHTML = `<b>Name: </b><span style='color: ${fish.favoriteColor}'>${fish.name}</span>`;
        fishInfo.innerHTML += `<br><b>Mood: </b>${fish.mood}`;
        fishInfo.innerHTML += `<br /><b>Favorite food: </b>${fish.favoriteFood}`;
        
        fishDiv.appendChild(fishImage);
        fishDiv.appendChild(fishInfo);

        fishDiv.addEventListener("click", function () {
          this.setJournalSelected(fish); 
        }.bind(this)); 
        
        listDiv.appendChild(fishDiv); 
      }); 
  }

  setJournalSelected(fish) {
    this.journalSelected = fish;
    
    let selectedDiv = document.querySelector("#fish-details");
    selectedDiv.innerHTML = ""; 

    let fishImage = document.createElement("img");
    fishImage.src = `assets/fish/fish${fish.type}.png`;
    
    let fishInfo = document.createElement("div");
    fishInfo.innerHTML = `<b>Name: </b><span style='color: ${fish.favoriteColor}'>${fish.name}</span>`;
    fishInfo.innerHTML += `<br><b>Mood: </b>${fish.mood}`;
    fishInfo.innerHTML += `<br /><b>Favorite food: </b>${fish.favoriteFood}`;

    let fishHistory = document.createElement("div");
    fishHistory.innerHTML = "<br /><b>History:</b>";
    if (!fish.history.length) {
      fishHistory.innerHTML += " none yet"; 
    }
    for(let history of fish.history) {
      fishHistory.innerHTML += `<br />${history}`;
    }
    
    selectedDiv.appendChild(fishImage);
    selectedDiv.appendChild(fishInfo);
    selectedDiv.appendChild(fishHistory); 
  }

  updateFishJournal(fish) {
    // Only update that specific fish's div.
    let fishDiv = document.querySelector(`.${fish.name}${fish.favoriteFood}${fish.type}`);
    if (!fishDiv) return;

    fishDiv.innerHTML = ""; 
    
    let fishImage = document.createElement("img");
    fishImage.src = `assets/fish/fish${fish.type}.png`;
    
    let fishInfo = document.createElement("div");
    fishInfo.innerHTML = `<b>Name: </b><span style='color: ${fish.favoriteColor}'>${fish.name}</span>`;
    fishInfo.innerHTML += `<br><b>Mood: </b>${fish.mood}`;
    fishInfo.innerHTML += `<br /><b>Favorite food: </b>${fish.favoriteFood}`;
    
    fishDiv.appendChild(fishImage);
    fishDiv.appendChild(fishInfo);

    // If selected, update the selected fish
    if (this.journalSelected === fish) {
      this.updateJournalSelected(fish); 
    }
  }
  
  updateFishStats() {
    let happyCount = fishInTank.filter(fish => fish.goodMood).length;
    let total = fishInTank.length;
    let percentage = happyCount / total * 100; 
    
    let span = document.querySelector("#happy-percentage");
    span.innerText = parseFloat(percentage).toFixed(2) + "%";
  }

  addRecord(text, fish1, fish2) {
    this.records.unshift({
      text, fish1, fish2
    });

    if (this.records.length > 15) {
      this.records = this.records.slice(0, 15)
    }
    
    // Update the records UI
    let recordsDiv = document.querySelector("#records");
    recordsDiv.innerHTML = "";
    
    this.records.forEach(record => {
      let recordDiv = document.createElement("div");

      // Replace placeholders in the text with fish names
      let formattedText = record.text.replace("FISH1", `<span style='color:${record.fish1.favoriteColor}'>${record.fish1.name}</span>`);
      if (record.fish2) {
        formattedText = formattedText.replace("FISH2", `<span style='color:${record.fish2.favoriteColor}'>${record.fish2.name}</span>`);
      }

      // Set the formatted text inside recordDiv
      recordDiv.innerHTML = formattedText;

      // Add the "record" class to recordDiv
      recordDiv.classList.add("record");

      // Add a click handler to recordDiv
      recordDiv.addEventListener("click", function() {
        // Update the selected status of all fishInTank to false
        fishInTank.forEach(fish => {
          if (fish.selected) {
            this.updateSelected(fish, false)
          }
        });

        // Update the selected status of fish1 to true
        this.updateSelected(record.fish1, true);

        // If fish2 is not null, update its selected status to true
        if (record.fish2) {
          this.updateSelected(record.fish2, true);
        }
      }.bind(this));

      // Append recordDiv to recordsDiv
      recordsDiv.appendChild(recordDiv);
    }); 
  }

  toggleMusic() {
    let btn = document.querySelector('#music-button');
    if (bgMusic.isPlaying()) {
      bgMusic.pause();
      btn.innerText = "music: off";
    } else {
      bgMusic.loop();
      btn.innerText = "music: on"; 
    }
  }
}
