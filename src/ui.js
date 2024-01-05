export default class UIManager {
  constructor () {
    this.records = [];

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
      fishInfo.innerHTML = `<b>Name: </b>${fish.name}`;
      fishInfo.innerHTML += `<br><b>Mood: </b>${fish.mood}`;
      fishInfo.innerHTML += `<br /><b>Favorite food: </b>${fish.favoriteFood}`;

      fishDiv.appendChild(fishImage);
      fishDiv.appendChild(fishInfo);
      
      // Add it to the selected fish div
      selectedFishDiv.appendChild(fishDiv); 
    });
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
      let formattedText = record.text.replace("FISH1", record.fish1.name);
      if (record.fish2) {
        formattedText = formattedText.replace("FISH2", record.fish2.name);
      }

      // Set the formatted text inside recordDiv
      recordDiv.textContent = formattedText;

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
}
