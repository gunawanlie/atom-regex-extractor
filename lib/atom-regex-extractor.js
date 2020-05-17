'use babel';

import AtomRegexExtractorView from './atom-regex-extractor-view';
import { CompositeDisposable } from 'atom';

export default {

  atomRegexExtractorView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomRegexExtractorView = new AtomRegexExtractorView(state.atomRegexExtractorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomRegexExtractorView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-regex-extractor:extract': () => this.extract()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomRegexExtractorView.destroy();
  },

  serialize() {
    return {
      atomRegexExtractorViewState: this.atomRegexExtractorView.serialize()
    };
  },

  extract() {
    var strings = [];
    let resultCount = this.getResultCount();
    for (i = 0; i < resultCount; i++) {
      this.findNext();
      strings.push(this.getSelectedText());
    }

    try {
      atom.workspace.open().then(editor => {
        editor.setText(strings.join("\n\r"));
      });
    } catch(error) {

    }
  },

  isSearchByRegex() {
    return this.getFindAndReplacePackage().findOptions.useRegex;
  },

  getResultCount() {
    return this.getFindAndReplacePackage().findModel.markers.length;
  },

  getSelectedText() {
    return atom.workspace.getActiveTextEditor().getSelectedText();
  },

  findNext() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), "find-and-replace:find-next");
  },

  getFindAndReplacePackage() {
    let package;
    try {
      package = atom.packages.loadedPackages["find-and-replace"];
    } catch(e) {
      throw new Error("Missing package: `find-and-replace`");
    }
    return package.mainModule;
  }
};
