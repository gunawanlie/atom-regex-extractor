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
    console.log('AtomRegexExtractor was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
