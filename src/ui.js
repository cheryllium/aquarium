export default class UIManager {
  constructor () {
    this.records = []; 
  }
  
  updateSelected(fish, value) {
    fish.selected = value;
    
    // Todo- Update the UI
    let selectedFish = fishInTank.filter(fish => fish.selected);
    let selectedFishDiv = document.querySelector("#selected-fish");
    selectedFishDiv.innerHTML = "";
    
    selectedFish.forEach(fish => {
      // Construct the new element
      let fishDiv = document.createElement("div");
      
      let fishImage = document.createElement("img");
      fishImage.src = `assets/fish/fish${fish.type}.png`;
      
      // Create paragraphs for the name and personality
      let nameParagraph = document.createElement("p");
      nameParagraph.innerHTML = `<b>Name: </b>${fish.name}`;

      fishDiv.appendChild(fishImage);
      fishDiv.appendChild(nameParagraph);
      
      // Add it to the selected fish div
      selectedFishDiv.appendChild(fishDiv); 
    });
  }

  addRecord(text, fish1, fish2) {
    this.records.unshift({
      text, fish1, fish2
    });

    if (this.records.length > 15) {
      this.records = this.records.slice(0, 15)
    }
    
    // Update the records
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
        console.log('clicked', record.fish1);
        
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
