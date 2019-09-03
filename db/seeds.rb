# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
start = Time.now
puts 'Destroying users...'
User.destroy_all

puts 'Creating users...'
pw = 'password'
lk = 'Lion King'
mufasa = User.create!(name: 'Mufasa', email: 'mufasa@lionking.com', movie: lk, password: pw)
sarabi = User.create!(name: 'Sarabi', email: 'sarabi@lionking.com', movie: lk, password: pw)
rafiki = User.create!(name: 'Rafiki', email: 'rafiki@lionking.com', movie: lk, password: pw)
shenzi = User.create!(name: 'Shenzi', email: 'shenzi@lionking.com', movie: lk, password: pw)
benzai = User.create!(name: 'Benzai', email: 'benzai@lionking.com', movie: lk, password: pw)
simba = User.create!(name: 'Simba', email: 'simba@lionking.com', movie: lk, password: pw)
timon = User.create!(name: 'Timon', email: 'timon@lionking.com', movie: lk, password: pw)
pumba = User.create!(name: 'Pumba', email: 'pumba@lionking.com', movie: lk, password: pw)
nala = User.create!(name: 'Nala', email: 'nala@lionking.com', movie: lk, password: pw)
scar = User.create!(name: 'Scar', email: 'scar@lionking.com', movie: lk, password: pw)
zazu = User.create!(name: 'Zazu', email: 'zazu@lionking.com', movie: lk, password: pw)
ed = User.create!(name: 'Ed', email: 'ed@lionking.com', movie: lk, password: pw)

al = 'Aladdin'
jasmine = User.create!(name: 'Jasmine', email: 'jasmine@aladdin.com', movie: al, password: pw)
aladdin = User.create!(name: 'Aladdin', email: 'aladdin@aladdin.com', movie: al, password: pw)
genie = User.create!(name: 'Genie', email: 'genie@aladdin.com', movie: al, password: pw)
jafar = User.create!(name: 'Jafar', email: 'jafar@aladdin.com', movie: al, password: pw)
rajah = User.create!(name: 'Rajah', email: 'rajah@aladdin.com', movie: al, password: pw)
iago = User.create!(name: 'Iago', email: 'iago@aladdin.com', movie: al, password: pw)
abu = User.create!(name: 'Abu', email: 'abu@aladdin.com', movie: al, password: pw)

bb = 'Beauty and the Beast'
beast = User.create!(name: 'Beast', email: 'beast@aladdin.com', movie: bb, password: pw)
belle = User.create!(name: 'Belle', email: 'belle@aladdin.com', movie: bb, password: pw)
gaston = User.create!(name: 'Gaston', email: 'gaston@aladdin.com', movie: bb, password: pw)
lumiere = User.create!(name: 'Lumiere', email: 'lumiere@aladdin.com', movie: bb, password: pw)
pots = User.create!(name: 'Ms. Potts', email: 'mspotts@aladdin.com', movie: bb, password: pw)
cogsworth = User.create!(name: 'Cogsworth', email: 'cogsworth@aladdin.com', movie: bb, password: pw)

# POSTS
puts 'Destroy posts...'
Post.destroy_all
puts 'Creating posts...'
p1 = Post.create!(body: 'Simbaa, do you see everything the light touches?',
  author_id: mufasa.id, receiver_id: simba.id)
p2 = Post.create!(body: 'Hakuna Matata, Puumbaa!!',
  author_id: timon.id, receiver_id: pumba.id)
p3 = Post.create!(body: 'Its our problem free, philosophy',
  author_id: pumba.id, receiver_id: timon.id)
p4 = Post.create!(body: 'I laguh in the face of danger! HAHAHAHA',
  author_id: simba.id, receiver_id: nala.id)
p5 = Post.create!(body: 'Be.. ourr.... gueesssttt',
  author_id: lumiere.id, receiver_id: belle.id)
p6 = Post.create!(body: 'Do you trust me??',
  author_id: aladdin.id, receiver_id: jasmine.id)
p7 = Post.create!(body: 'All you gotta do is rub that lamp!',
  author_id: genie.id, receiver_id: aladdin.id)
p8 = Post.create!(body: 'Who does that beast think he is!?',
  author_id: gaston.id, receiver_id: gaston.id)
p9 = Post.create!(body: 'Enter, the cave of wonderrss!',
  author_id: jafar.id, receiver_id: aladdin.id)
p10 = Post.create!(body: 'You\'re not even a real prince...',
  author_id: jasmine.id, receiver_id: aladdin.id)
p11 = Post.create!(body: 'Oh yeah Jafar, great idea!! Mwahaha',
  author_id: iago.id, receiver_id: jafar.id)
p12 = Post.create!(body: 'Bring me the lamp!!',
  author_id: jafar.id, receiver_id: aladdin.id)
p13 = Post.create!(body: 'uh uh ih ih -- awhhh',
  author_id: abu.id, receiver_id: aladdin.id)
p14 = Post.create!(body: 'Asante sana squash banana!',
  author_id: rafiki.id, receiver_id: rafiki.id)
p15 = Post.create!(body: 'Arent u simbas girl?',
  author_id: mufasa.id, receiver_id: nala.id)
p16 = Post.create!(body: 'Hey, father-in-law - lol',
  author_id: nala.id, receiver_id: mufasa.id)
p17 = Post.create!(body: 'What movies are you in again?',
  author_id: jafar.id, receiver_id: mufasa.id)

# COMMENTS
puts 'Destroying comments...'
Comment.destroy_all
puts 'Creating comments...'
Comment.create!(body: 'Yes, dad?', author: simba, post: p1)
Comment.create!(body: 'Dont do it Aladdin!! I saw the movie!', author: mufasa, post: p9)
Comment.create!(body: 'Hey, loved your song... roar!', author: mufasa, post: p4)
Comment.create!(body: 'No, Simba! Dont!!', author: nala, post: p4)
Comment.create!(body: 'hahAHhAhAhHAhaHihihIhihHihiHiI', author: ed, post: p4)
Comment.create!(body: 'Aww, man... you had to do it!!??', author: nala, post: p4)
Comment.create!(body: 'HIhihhIhIHAHA', author: shenzi, post: p4)
Comment.create!(body: 'uhAHuHAUhUAHuaihaiha', author: benzai, post: p4)

# FRIENDSHIPSs
puts 'Destroying friendships...'
Friendship.destroy_all
puts 'Creating friendships...'
Friendship.create!(friendee_id: mufasa.id,  friender_id: simba.id,    status: 'pending')
Friendship.create!(friendee_id: rafiki.id,  friender_id: aladdin.id,  status: 'accepted')
Friendship.create!(friendee_id: rafiki.id,  friender_id: genie.id,    status: 'accepted')
Friendship.create!(friendee_id: rafiki.id,  friender_id: simba.id,    status: 'pending')
Friendship.create!(friendee_id: rafiki.id,  friender_id: iago.id,     status: 'accepted')
Friendship.create!(friendee_id: rafiki.id,  friender_id: nala.id,     status: 'accepted')
Friendship.create!(friendee_id: rafiki.id,  friender_id: abu.id,      status: 'pending')
Friendship.create!(friendee_id: mufasa.id,  friender_id: abu.id,      status: 'pending')
Friendship.create!(friendee_id: mufasa.id,  friender_id: nala.id,     status: 'accepted')
Friendship.create!(friendee_id: mufasa.id,  friender_id: jafar.id,    status: 'accepted')
Friendship.create!(friendee_id: rafiki.id,  friender_id: mufasa.id,   status: 'accepted')
Friendship.create!(friendee_id: nala.id,    friender_id: aladdin.id,  status: 'accepted')
Friendship.create!(friendee_id: aladdin.id, friender_id: abu.id,      status: 'pending')
Friendship.create!(friendee_id: aladdin.id, friender_id: genie.id,    status: 'pending')
Friendship.create!(friendee_id: jasmine.id, friender_id: aladdin.id,  status: 'pending')

puts "finished seeding in #{Time.now - start}s"