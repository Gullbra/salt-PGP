

class Puppy:
    def __init__(self, name, breed, birth_date, pup_id=None):
        self.name = name
        self.breed = breed
        self.birth_date = birth_date
        if pup_id is not None and type(pup_id) == 'int':
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
        """
        if kwargs.get('id'):
            if not type(kwargs.get('id')) == 'int':
                raise Exception('Invalid Id provided')
            for pup in self.__db:
                if kwargs.get('id') == pup.id:
                    raise Exception('Id provided is already used')
        """
        new_puppy = Puppy(
            kwargs.get('name'),
            kwargs.get('breed'),
            kwargs.get('birth_date')
        )
        if len(self.__db) == 0:
            new_puppy.id = 0
        else:
            new_puppy.id = max(self.__db, key=lambda pup: pup.id).id + 1

        self.__db.append(new_puppy)

        return new_puppy


"""
PuppyDB = Db([
    Puppy('Miyumi', 'Akita', '2018-03-10', 0),
    Puppy('Tova', 'Poodle', '2017-06-30', 1)
])

PuppyDB.add_one(breed='shephard', name='dogmeat', birth_date='2230-03-30')

print(
    PuppyDB.get_all()[len(PuppyDB.get_all())-1].__dict__
)
"""

