import icons from "url:../../img/icons.svg"; // parcel 2
import View from "./View.js";
import previewView from "./previewView.js";
class ResultsView extends View {
  _parentEl = document.querySelector(".results");
  _errorMessage = "No recipe found for your query! Please try again ;)";
  _message = "";

  _generateMarkup() {
    console.log(this._data);
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
