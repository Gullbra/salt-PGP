import { IPuppy } from "../Interfaces/Interfaces"

const dogNames:string[] = [
  'Brian Griffin',
  'Seymore Asses',
  "Santas' Little Helper",
  'Scooby-Doo',
  'Poppins',
  'Max',
  'Bella',
  'Luna',
  'Cooper',
  'Milo',
  'Charlie'
]
const dogBreeds:string[] = [
  'Poodle',
  'Corgie',
  'Akita',
  'Shiba',
  'German Shephard',
  'Golden Retriever'
]


class Puppy implements IPuppy {
  constructor (
    public id:number, 
    public breed:string, 
    public name:string, 
    public birthDate:string
  ) {}
}

export class Db {
  private _db: IPuppy[] = []

  constructor (numberOfentries:number){
    for(let i=0; i < numberOfentries; i++) {
      this._db.push(new Puppy(
        i,
        dogBreeds[Math.floor(Math.random() * dogBreeds.length)],
        dogNames[Math.floor(Math.random() * dogNames.length)],
        new Date(Date.now() - Math.random() * 3600 * 24 * 365 * 10).toLocaleDateString()
      ))
    }
  }

  public getAll() {
    return this._db
  }

  public addPuppy(newPuppy:IPuppy):IPuppy {
    if (!newPuppy.breed || !newPuppy.birthDate || !newPuppy.name) {
      throw new Error('Missing data')
    }

    if (newPuppy.id) {
      if (this._db.find(pup => pup.id === newPuppy.id)) {
        throw new Error(`Id "${newPuppy.id}" is already in use`)
      }
    } else {
      newPuppy.id = this._db.reduce((highest, puppy) => {
        return puppy.id && puppy.id > highest ? puppy.id : highest
      }, 0) + 1
    }

    this._db.push(newPuppy)
    return newPuppy
  }

  public getByID (id:number):IPuppy {
    const puppy:(IPuppy | undefined) = this._db.find(pup => pup.id === id)
    if (puppy) {
      return puppy 
    }
    throw new Error(`No puppy with id "${id}" found`)
  }
  
  public editPuppyById (id:number, editedPuppy:IPuppy): IPuppy {
    for (const key of Object.keys(editedPuppy)) {
      if(!/^(breed|name|birthDate)$/.test(key)) throw new Error('Invalid input')
    }

    const puppyIndex:(number) = this._db.findIndex(pup => pup.id === id)
    if(puppyIndex === -1) throw new Error(`No puppy with id "${id}" found`)
  
    const updatedPuppy = {...this._db[puppyIndex], ...editedPuppy}
    this._db[puppyIndex] = updatedPuppy

    return updatedPuppy
  }

  public deletePuppyById(id:number):IPuppy {
    const puppyIndex:(number) = this._db.findIndex(pup => pup.id === id)
    if(puppyIndex === -1){
      throw new Error(`No puppy with id "${id}" found`)
    }
    
    const puppyToDelete = this._db[puppyIndex]
    this._db.splice(puppyIndex, 1)
    return puppyToDelete
  }
}
