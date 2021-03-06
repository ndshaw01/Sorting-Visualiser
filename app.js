new Vue({
    el: "#app",
    data: {
        sortingMode: 'bubbleSort',
        arraySize: 50,
        sortSpeed: 150,
        values: [],
        sorting: false,
        sorted: false
    },
    methods: {
        //Method to randomise all array values
        scramble: function() {
            this.values = [];
            this.sorting = false;
            this.sorted = false;
            for (let i = 0; i < this.arraySize; i++) {
                /*Looks strange but I use an object here so rerendering occurs for individual blocks instead
                  Of having the whole app rerender on every bubblesort iteration, also allows me to add colour information */
                let obj = {
                    'id': Math.random() * 100,
                    'sorted': false,
                    'active': false,
                };
                this.values.push(obj);
            }
        },
        //Function to select a certain sorting algorithm based on which is selected
        async sort() {
            //Setting state variables so sorting cannot be invoked twice at once
            this.sorting = true;
            switch (this.sortingMode) {
                case "bubbleSort":
                    await this.bubbleSort();
                    break;
                case "insertionSort":
                    await this.insertionSort();
                    break;
                case "mergeSort":
                    let arr = [];
                    for (let i = 0; i < this.arraySize; i++) {
                        arr[i] = this.values[i].id;
                    }
                    let sortedArray = await this.mergeSort(arr, 0);
                    for (let i = 0; i < this.arraySize; i++) {
                        this.values[i].sorted = true;
                    }
                    break;
            }
            //Resetting state variable so you can sort again
            this.sorting = false;
            this.sorted = true;
        },
        //Simple bubble sort algorithm
        async bubbleSort() {

            for (let i = 0; i < this.arraySize; i++) {
                for (let j = 0; j < this.arraySize - i - 1; j++) {
                    //Changes the current active bar to purple
                    this.values[j].active = true;
                    await this.swapValues(j, j + 1);
                    //change the active bars to false
                    this.values[j].active = false;
                    this.values[j + 1].active = false;

                }
                //Changes bar colour to green
                this.values[this.arraySize - i - 1].sorted = true;
            }
        },
        //Split into separate function here to deal with the async problems that arise with having setTimeout in a loop
        swapValues: function(j, active) {
            if (this.values[j].id > this.values[j + 1].id) {
                //If a bar is being switched, colour it purple
                this.values[active].active = true;
                //Switch the two values
                let tmp = this.values[j].id;
                this.values[j].id = this.values[j + 1].id;
                this.values[j + 1].id = tmp
            }
            // wait for sortSpeed amt of time
            return new Promise(resolve => setTimeout(resolve, 300 - this.sortSpeed));

        },


        //INSERTION SORT
        async insertionSort() {
            for (let i = 1; i < this.arraySize; i++) {
                this.values[i].sorted = true;
                let j = i;
                while (j > 0 && this.values[j - 1].id > this.values[j].id) {
                    await this.swapValues(j - 1, j - 1);
                    this.values[j - 1].active = false;
                    j--;
                }
                this.values[i].sorted = false;
            }
            for (let i = 0; i < this.arraySize; i++) {
                this.values[i].sorted = true;
            }
        },



        //MERGE SORT
        async merge(arr1, arr2, index) {
            let sortedArr = [];
            while (arr1.length && arr2.length) {
                if (arr1[0] <= arr2[0]) {
                    sortedArr.push(arr1.shift());
                } else {
                    sortedArr.push(arr2.shift());
                }
            }
            while (arr1.length) {
                sortedArr.push(arr1.shift());
            }
            while (arr2.length) {
                sortedArr.push(arr2.shift());
            }
            for (let i = 0; i < sortedArr.length; i++) {
                await this.changeValue(i + index, sortedArr[i]);
                this.values[i].active = false;
            }
            return sortedArr;
        },
        changeValue(i, value) {
            this.values[i].id = value;
            this.values[i].active = true;
            return new Promise(resolve => setTimeout(resolve, 300 - this.sortSpeed));
        },
        async mergeSort(arr, index) {
            if (arr.length < 2) {
                return arr;
            } else {
                var midpoint = parseInt(arr.length / 2);
                var leftArr = arr.slice(0, midpoint);
                var rightArr = arr.slice(midpoint, arr.length);
                return this.merge(await this.mergeSort(leftArr, index), await this.mergeSort(rightArr, index + midpoint), index);
            }
        }
        //MERGE SORT END

    },
    computed: {
        blockWidth: function() {
            return 100 / this.arraySize + '%';
        }

    },
    //After the instance is initialised, all array elements get randomised
    created() {
        this.scramble();
    },
    watch: {
        arraySize: function() {
            this.scramble();
        }
    }

});