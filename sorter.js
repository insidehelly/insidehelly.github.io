class TournamentSorter {
  constructor(data, { selectors }) {
    this.data = data;
    this.items = Object.keys(data);
    this.selectors = selectors;

    this.history = [];
    this.state = {};

    this._bindToDOM();
  }

    _bindToDOM() {
        this.elements = {
            leftOption: document.querySelector(this.selectors.leftOption),
            rightOption: document.querySelector(this.selectors.rightOption),
            tieButton: document.querySelector(this.selectors.tieButton),
            undoButton: document.querySelector(this.selectors.undoButton),
            battleCounter: document.querySelector(this.selectors.battleCounter),
            progressBar: document.querySelector(this.selectors.progressBar),
            progressBarContainer: document.querySelector(this.selectors.progressBarContainer),
            sorterContainer: document.querySelector(this.selectors.sorterContainer),
            resultContainer: document.querySelector(this.selectors.resultContainer),
            resetButton: document.querySelector(this.selectors.resetButton)
        };

        this.elements.leftOption.addEventListener("click", () => this.select(-1));
        this.elements.rightOption.addEventListener("click", () => this.select(1));
        this.elements.tieButton.addEventListener("click", () => this.select(0));
        this.elements.undoButton.addEventListener("click", () => this.undo());
    }

  // Main method to start the sorting process
  start() {
    this.state = this._getInitialState();
    this.history = [];
    this.elements.sorterContainer.style.display = "block";
    this.elements.resultContainer.innerHTML = "";
    this.elements.resultContainer.style.display = "none";
    this._updateDisplay();
  }

  // Generates the initial state for the merge sort
  _getInitialState() {
    const state = {
      lstMember: [this.items.map((_, i) => i)],
      parent: [-1],
      equal: Array(this.items.length + 1).fill(-1),
      rec: Array(this.items.length).fill(0),
      nrec: 0,
      finishSize: 0,
      totalSize: 0,
      numQuestion: 0,
      cmp1: -1,
      cmp2: -1,
    };

    let n = 1;
    for (let i = 0; i < state.lstMember.length; i++) {
      if (state.lstMember[i].length >= 2) {
        const mid = Math.ceil(state.lstMember[i].length / 2);
        const listA = state.lstMember[i].slice(0, mid);
        const listB = state.lstMember[i].slice(mid);
        state.lstMember[n] = listA;
        state.parent[n] = i;
        state.totalSize += listA.length;
        n++;
        state.lstMember[n] = listB;
        state.parent[n] = i;
        state.totalSize += listB.length;
        n++;
      }
    }
    state.cmp1 = state.lstMember.length - 2;
    state.cmp2 = state.lstMember.length - 1;
    state.head1 = 0;
    state.head2 = 0;

    return state;
  }

  // Handles a user's selection (left, right, or tie)
  select(flag) {
    this._saveState();

    const { lstMember, cmp1, cmp2, equal } = this.state;
    let { head1, head2 } = this.state;

    if (flag < 0) { // Left wins
      this._addResult(lstMember[cmp1][head1++]);
    } else if (flag > 0) { // Right wins
      this._addResult(lstMember[cmp2][head2++]);
    } else { // Tie
      this._addResult(lstMember[cmp1][head1++]);
      equal[this.state.rec[this.state.nrec - 1]] = lstMember[cmp2][head2]; // Mark as equal
      this._addResult(lstMember[cmp2][head2++]);
    }

    // After a choice, check if one list is exhausted and add the rest of the other
    if (head1 < lstMember[cmp1].length && head2 === lstMember[cmp2].length) {
      while (head1 < lstMember[cmp1].length) this._addResult(lstMember[cmp1][head1++]);
    } else if (head2 < lstMember[cmp2].length && head1 === lstMember[cmp1].length) {
      while (head2 < lstMember[cmp2].length) this._addResult(lstMember[cmp2][head2++]);
    }

    this.state.head1 = head1;
    this.state.head2 = head2;

    // Check if the current comparison (merge) is finished
    if (this.state.head1 === lstMember[cmp1].length && this.state.head2 === lstMember[cmp2].length) {
      for (let i = 0; i < lstMember[cmp1].length + lstMember[cmp2].length; i++) {
        lstMember[this.state.parent[cmp1]][i] = this.state.rec[i];
      }
      lstMember.pop();
      lstMember.pop();
      this.state.cmp1 -= 2;
      this.state.cmp2 -= 2;
      this.state.head1 = 0;
      this.state.head2 = 0;
      this.state.nrec = 0;
    }

    this._updateDisplay();
  }
  
  // Helper to add a winning item to the record
  _addResult(itemIndex) {
      this.state.rec[this.state.nrec] = itemIndex;
      this.state.finishSize++;
      this.state.nrec++; // This line was the fix
  }

  // --- Display and State Management ---

  undo() {
    if (this.history.length > 0) {
      this.state = this.history.pop();
      this._updateDisplay(true);
    }
  }

  _saveState() {
    this.history.push(JSON.parse(JSON.stringify(this.state)));
    this.elements.undoButton.disabled = false;
  }

  _updateDisplay(fromUndo = false) {
    if (this.state.cmp1 < 0) {
      this._showResult();
      return;
    }
    
    // Increment question number only if it's a new battle
    if(this.state.head1 === 0 && this.state.head2 === 0) {
        if(!fromUndo) this.state.numQuestion++;
    }

    const { lstMember, cmp1, cmp2, head1, head2, numQuestion, finishSize, totalSize } = this.state;
    const item1Index = lstMember[cmp1][head1];
    const item2Index = lstMember[cmp2][head2];
    
    const item1 = this.data[this.items[item1Index]];
    const item2 = this.data[this.items[item2Index]];

    // Render left option
    this.elements.leftOption.innerHTML = `
        <img src="${item1.image}" alt="${this.items[item1Index]}">
        <h3>${this.items[item1Index]}</h3>
        <p>Season ${item1.season}, Episode ${item1.episode}</p>`;
        
    // Render right option
    this.elements.rightOption.innerHTML = `
        <img src="${item2.image}" alt="${this.items[item2Index]}">
        <h3>${this.items[item2Index]}</h3>
        <p>Season ${item2.season}, Episode ${item2.episode}</p>`;
        
    // Update progress
    const progress = Math.floor((finishSize * 100) / totalSize);
    this.elements.battleCounter.textContent = `Battle #${numQuestion}`;
    this.elements.progressBarContainer.innerHTML = `
    <div id="progress-bar"></div>
    <div id="progress-percent">${progress}% Complete</div>
    `;
    document.querySelector("#progress-bar").style.width = `${progress}%`;
  }

  _showResult() {
    this.elements.sorterContainer.style.display = "none";
    this.elements.resultContainer.style.display = "block";
    let ranking = 1;
    let sameRank = 1;

    const finalOrder = this.state.lstMember[0];
    let resultHTML = "<h2>Your Final Ranking</h2><table>";
    resultHTML += "<tr><th>Rank</th><th>Episode</th><th>Episode</th></tr>";

    finalOrder.forEach((itemIndex, i) => {
        const item = this.data[this.items[itemIndex]];
        resultHTML += `
            <tr>
                <td class="rank">${ranking}</td>
                <td class="title-cell">
                    <img src="${item.image}" alt="${this.items[itemIndex]}" class="result-img">
                    <span>${this.items[itemIndex]}</span>
                </td>
                <td class="se">${item.season}.${item.episode <= 9 ? "0" + item.episode : item.episode}</td>
            </tr>
        `;

        if (i < finalOrder.length - 1 && this.state.equal[itemIndex] === finalOrder[i+1]) {
            sameRank++;
        } else {
            ranking += sameRank;
            sameRank = 1;
        }
    });

    resultHTML += `</table><br><button id="reset-button" onclick="window.location.reload()">Reset</button>`;
    this.elements.resultContainer.innerHTML = resultHTML;
  }
}