
class Puppy:
    def __init__(self, name, breed, birth_date, pup_id=None):
        self.name = name
        self.breed = breed
        self.birth_date = birth_date
        if isinstance(pup_id, int):
            self.id = pup_id


class Db:
    def __init__(self, db=None):
        if db is None:
            db = []
        self.__db = db

    def get_all(self):
        return self.__db

    def add_one(self, **kwargs):
        if not kwargs.get('name') or not kwargs.get('breed') or not kwargs.get('birth_date'):
            raise Exception("Invalid input")

        new_puppy = Puppy(
            kwargs.get('name'),
            kwargs.get('breed'),
            kwargs.get('birth_date'))

        if kwargs.get('id'):
            try:
                new_puppy.id = int(kwargs.get('id'))
                for pup in self.__db:
                    if new_puppy.id == pup.id:
                        raise Exception('Id provided is already used')
            except Exception:
                raise Exception('Invalid Id provided')
        elif len(self.__db) == 0:
            new_puppy.id = 0
        else:
            new_puppy.id = max(self.__db, key=lambda pup: pup.id).id + 1

        self.__db.append(new_puppy)
        return new_puppy

    def get_one(self, pup_id):
        puppy_match = [pup for pup in self.__db if pup.id == int(pup_id)]
        if len(puppy_match) == 0:
            raise Exception(f'No puppy with Id {pup_id} found')
        return puppy_match[0]

    def update_one(self, pup_id, **kwargs):
        puppy_match = [pup for pup in self.__db if pup.id == int(pup_id)]
        if len(puppy_match) == 0:
            raise Exception(f'No puppy with Id {pup_id} found')
        # db_index = self.__db.index(puppy_match)
        db_index = next((i for i, pup in enumerate(self.__db) if pup.id == int(pup_id)))

        if kwargs.get('name'): puppy_match[0].name = kwargs.get('name')
        if kwargs.get('breed'): puppy_match[0].breed = kwargs.get('breed')
        if kwargs.get('birth_date'): puppy_match[0].birth_date = kwargs.get('birth_date')

        self.__db[db_index] = puppy_match[0]
        return puppy_match[0]

    def delete_one(self, pup_id):
        for index, pup in enumerate(self.__db):
            if pup.id == int(pup_id):
                break
        else:
            raise ValueError(f'No puppy with Id {pup_id} found')
        self.__db.pop(index)
        return pup
