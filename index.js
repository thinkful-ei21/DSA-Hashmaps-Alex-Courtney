class HashMap {
    constructor(initialCapacity=8) {
        this.length = 0;
        this._slots = [];
        this._capacity = initialCapacity;
    }

    static _hashString(string) {
        let hash = 5381;
        for (let i=0; i<string.length; i++) {
            hash = (hash << 5) + hash + string.charCodeAt(i);
            hash = hash & hash;
        }
        return hash >>> 0;
    }

    get(key) {
        const index = this._findSlot(key);
        if (this._slots[index] === undefined) {
            throw new Error('Key error');
        }
        return this._slots[index].value;
    }

    set(key, value) {
        const loadRatio = (this.length + this._deleted + 1) / this._capacity;
        if (loadRatio > HashMap.MAX_LOAD_RATIO) {
            this._resize(this._capacity * HashMap.SIZE_RATIO);
        }

        const index = this._findSlot(key);

        if(!this._slots[index]) {
            this.length++;
        }

        this._slots[index] = {
            key,
            value,
            deleted: false
        };

    }

    _findSlot(key) {
        const hash = HashMap._hashString(key);
        const start = hash % this._capacity;

        for (let i=start; i<start + this._capacity; i++) {
            const index = i % this._capacity;
            const slot = this._slots[index];
            if (slot === undefined || (slot.key == key && !slot.deleted)) {
                return index;
            }
        }
    }

    _resize(size) {
        console.log("resized")
        const oldSlots = this._slots;
        this._capacity = size;
        // Reset the length - it will get rebuilt as you add the items back
        this.length = 0;
        this._deleted = 0;
        this._slots = [];

        for (const slot of oldSlots) {
            if (slot !== undefined && !slot.deleted) {
                this.set(slot.key, slot.value);
            }
        }
    }


    remove(key) {
        const index = this._findSlot(key);
        const slot = this._slots[index];
        if (slot === undefined) {
            throw new Error('Key error');
        }
        slot.deleted = true;
        this.length--;
        this._deleted++;
    }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

function pal(str) {

    let palHash = new HashMap();

    for (let x=0; x<str.length; x++) {
        let tempValue;

        try {
          tempValue = palHash.get(str[x])
        } catch(err) {
          tempValue = 0;
        }

        palHash.set(str[x], tempValue + 1);
    }

    let odd = 0;
    for (let i = 0; i < palHash.length; i++) {
      if (palHash.get(str[i]) % 2 !== 0) {
        odd++;
      }
    }

    if(odd > 1) {
      return false;
    }
    return true;

}


function main() {
  let lor = new HashMap();

//   lor.set("Hobbit", "Bilbo");
//   lor.set("Hobbit", "Frodo");
//   lor.set("Wizard", "Gandolf");

//   console.log(lor.get("Hobbit"));
// //   lor.set("Human", "Aragon");
// //   lor.set("Elf", "Legolas");
// //   lor.set("Maiar", "The Necromancer");
// //   lor.set("Maiar", "Sauron");
// //   lor.set("RingBearer", "Gollum");
// //   lor.set("LadyOfLight", "Galadriel");
// //   lor.set("HalfElven", "Arwen");
// //   lor.set("Ent", "Treebeard");

// //   console.log(lor.get("Maiar"))

//   console.log(lor);

console.log(pal("acearr"));

}

console.log(main());
