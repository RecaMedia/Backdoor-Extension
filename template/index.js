class [[namespace]] {

  constructor(api) {
    this.api = api;
  }

  test() {
    // Get extension url
    console.log("Extension URL: " + this.api.extURL());

    // Get extension file path
    console.log("Extension Path: " + this.api.extBasePath());

    // Get current directory
    console.log("Current Dir: " + this.api.currentDir());

    // Get opened files array
    console.log("Opened Files: ", this.api.openedFiles());

    // Get directory files array
    let files = this.api.getDirList(true);

    // Resolve promise from getDirList()
    files.then((list) => {
      
      // See directory list
      console.log("Directory List: ", list);

      // Check if file browser object is a file
      if (list[1].handler == "file") {

        // Load file
        let load_file = this.api.loadFile(list[1]);

        // Check if file is already loaded
        if (load_file) {
          console.log("You have opened a file");
        } else {
          console.log("File is already open");
        }
      }
    });
  }
}