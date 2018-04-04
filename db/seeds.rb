# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
pw = 'password'
User.destroy_all
# Lion King
lk = 'Lion King'
User.create!(name: 'Mufasa', email: 'mufasa@lionking.com', movie: lk, password: pw)
User.create!(name: 'Sarabi', email: 'sarabi@lionking.com', movie: lk, password: pw)
User.create!(name: 'Rafiki', email: 'rafiki@lionking.com', movie: lk, password: pw)
User.create!(name: 'Shenzi', email: 'shenzi@lionking.com', movie: lk, password: pw)
User.create!(name: 'Benzai', email: 'benzai@lionking.com', movie: lk, password: pw)
User.create!(name: 'Simba', email: 'simba@lionking.com', movie: lk, password: pw)
User.create!(name: 'Timon', email: 'timon@lionking.com', movie: lk, password: pw)
User.create!(name: 'Pumba', email: 'pumba@lionking.com', movie: lk, password: pw)
User.create!(name: 'Nala', email: 'nala@lionking.com', movie: lk, password: pw)
User.create!(name: 'Scar', email: 'scar@lionking.com', movie: lk, password: pw)
User.create!(name: 'Zazu', email: 'zazu@lionking.com', movie: lk, password: pw)
User.create!(name: 'Ed', email: 'ed@lionking.com', movie: lk, password: pw)

mufasa = User.where(name: 'Mufasa')[0].id
rafiki = User.where(name: 'Rafiki')[0].id
simba = User.where(name: 'Simba')[0].id
nala = User.where(name: 'Nala')[0].id
timon = User.where(name: 'Timon')[0].id
pumba = User.where(name: 'Pumba')[0].id
ed = User.where(name: 'Ed')[0].id
shenzi = User.where(name: 'Shenzi')[0].id
benzai = User.where(name: 'Benzai')[0].id

# Aladdin
al = 'Aladdin'
User.create!(name: 'Jasmine', email: 'jasmine@aladdin.com', movie: al, password: pw)
User.create!(name: 'Aladdin', email: 'aladdin@aladdin.com', movie: al, password: pw)
User.create!(name: 'Genie', email: 'genie@aladdin.com', movie: al, password: pw)
User.create!(name: 'Jafar', email: 'jafar@aladdin.com', movie: al, password: pw)
User.create!(name: 'Rajah', email: 'rajah@aladdin.com', movie: al, password: pw)
User.create!(name: 'Iago', email: 'iago@aladdin.com', movie: al, password: pw)
User.create!(name: 'Abu', email: 'abu@aladdin.com', movie: al, password: pw)

iago = User.where(name: 'Iago')[0].id
genie = User.where(name: 'Genie')[0].id
abu = User.where(name: 'Abu')[0].id
aladdin = User.where(name: 'Aladdin')[0].id
jasmine = User.where(name: 'Jasmine')[0].id
jafar = User.where(name: 'Jafar')[0].id

# Beauty and the Beast
bb = 'Beauty and the Beast'
User.create!(name: 'Beast', email: 'beast@aladdin.com', movie: bb, password: pw)
User.create!(name: 'Belle', email: 'belle@aladdin.com', movie: bb, password: pw)
User.create!(name: 'Gaston', email: 'gaston@aladdin.com', movie: bb, password: pw)
User.create!(name: 'Lumiere', email: 'lumiere@aladdin.com', movie: bb, password: pw)
User.create!(name: 'Ms. Potts', email: 'mspotts@aladdin.com', movie: bb, password: pw)
User.create!(name: 'Cogsworth', email: 'cogsworth@aladdin.com', movie: bb, password: pw)

lumiere = User.where(name: 'Lumiere')[0].id
gaston = User.where(name: 'Gaston')[0].id
belle = User.where(name: 'Belle')[0].id

# POSTS
Post.destroy_all
Post.create!(body: 'Simbaa, do you see everything the light touches?',
  author_id: mufasa, receiver_id: simba)
Post.create!(body: 'Hakuna Matata, Puumbaa!!',
  author_id: timon, receiver_id: pumba)
Post.create!(body: 'Its our problem free, philosophy',
  author_id: pumba, receiver_id: timon)
  Post.create!(body: 'I laguh in the face of danger! HAHAHAHA',
  author_id: simba, receiver_id: nala)
Post.create!(body: 'Be.. ourr.... gueesssttt',
  author_id: lumiere, receiver_id: belle)
Post.create!(body: 'Do you trust me??',
  author_id: aladdin, receiver_id: jasmine)
Post.create!(body: 'All you gotta do is rub that lamp!',
  author_id: genie, receiver_id: aladdin)
Post.create!(body: 'Who does that beast think he is!?',
  author_id: gaston, receiver_id: gaston)
Post.create!(body: 'Enter, the cave of wonderrss!',
  author_id: jafar, receiver_id: aladdin)
Post.create!(body: 'You\'re not even a real prince...',
  author_id: jasmine, receiver_id: aladdin)
Post.create!(body: 'Oh yeah Jafar, great idea!! Mwahaha',
  author_id: iago, receiver_id: jafar)
Post.create!(body: 'Bring me the lamp!!',
  author_id: jafar, receiver_id: aladdin)
Post.create!(body: 'uh uh ih ih -- awhhh',
  author_id: abu, receiver_id: aladdin)
Post.create!(body: 'Asante sana squash banana!',
  author_id: rafiki, receiver_id: rafiki)
Post.create!(body: 'Arent u simbas girl?',
  author_id: mufasa, receiver_id: nala)
Post.create!(body: 'Hey, father-in-law - lol',
  author_id: nala, receiver_id: mufasa)
Post.create!(body: 'What movies are you in again?',
  author_id: jafar, receiver_id: mufasa)

# COMMENTS
Comment.destroy_all
Comment.create!(body: 'Yes, dad?', author_id: simba, post: Post.where(body: 'Simbaa, do you see everything the light touches?')[0])
Comment.create!(body: 'Dont do it Aladdin!! I saw the movie!', author_id: mufasa, post: Post.where(body: 'Enter, the cave of wonderrss!')[0])
Comment.create!(body: 'Hey, loved your song... roar!', author_id: mufasa, post: Post.where(body: 'Be.. ourr.... gueesssttt')[0])
Comment.create!(body: 'No, Simba! Dont!!', author_id: nala, post: Post.where(body: 'I laguh in the face of danger! HAHAHAHA')[0])
Comment.create!(body: 'hahAHhAhAhHAhaHihihIhihHihiHiI', author_id: ed, post: Post.where(body: 'I laguh in the face of danger! HAHAHAHA')[0])
Comment.create!(body: 'Aww, man... you had to do it!!??', author_id: nala, post: Post.where(body: 'I laguh in the face of danger! HAHAHAHA')[0])
Comment.create!(body: 'HIhihhIhIHAHA', author_id: shenzi, post: Post.where(body: 'I laguh in the face of danger! HAHAHAHA')[0])
Comment.create!(body: 'uhAHuHAUhUAHuaihaiha', author_id: benzai, post: Post.where(body: 'I laguh in the face of danger! HAHAHAHA')[0])

# FRIENDSHIPSs
Friendship.destroy_all
Friendship.create!(friendee_id: mufasa, friender_id: simba, status: 'pending')
Friendship.create!(friendee_id: rafiki, friender_id: aladdin, status: 'accepted')
Friendship.create!(friendee_id: rafiki, friender_id: genie, status: 'accepted')
Friendship.create!(friendee_id: rafiki, friender_id: simba, status: 'pending')
Friendship.create!(friendee_id: rafiki, friender_id: iago, status: 'accepted')
Friendship.create!(friendee_id: rafiki, friender_id: nala, status: 'accepted')
Friendship.create!(friendee_id: rafiki, friender_id: abu, status: 'pending')
Friendship.create!(friendee_id: mufasa, friender_id: abu, status: 'pending')
Friendship.create!(friendee_id: mufasa, friender_id: nala, status: 'accepted')
Friendship.create!(friendee_id: mufasa, friender_id: jafar, status: 'accepted')
Friendship.create!(friendee_id: rafiki, friender_id: mufasa, status: 'accepted')
Friendship.create!(friendee_id: nala, friender_id: aladdin, status: 'accepted')
Friendship.create!(friendee_id: aladdin, friender_id: abu, status: 'pending')
Friendship.create!(friendee_id: aladdin, friender_id: genie, status: 'pending')
Friendship.create!(friendee_id: jasmine, friender_id: aladdin, status: 'pending')
