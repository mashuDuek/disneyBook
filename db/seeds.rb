# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
pw = 'password'
User.destroy_all
# USERS
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
# Aladdin
al = 'Aladdin'
User.create!(name: 'Jasmine', email: 'jasmine@aladdin.com', movie: al, password: pw)
User.create!(name: 'Aladdin', email: 'aladdin@aladdin.com', movie: al, password: pw)
User.create!(name: 'Genie', email: 'genie@aladdin.com', movie: al, password: pw)
User.create!(name: 'Jafar', email: 'jafar@aladdin.com', movie: al, password: pw)
User.create!(name: 'Rajah', email: 'rajah@aladdin.com', movie: al, password: pw)
User.create!(name: 'Iago', email: 'iago@aladdin.com', movie: al, password: pw)
User.create!(name: 'Abu', email: 'abu@aladdin.com', movie: al, password: pw)
# Beauty and the Beast
bb = 'Beauty and the Beast'
User.create!(name: 'Beast', email: 'beast@aladdin.com', movie: bb, password: pw)
User.create!(name: 'Belle', email: 'belle@aladdin.com', movie: bb, password: pw)
User.create!(name: 'Gaston', email: 'gaston@aladdin.com', movie: bb, password: pw)
User.create!(name: 'Lumière', email: 'lumiere@aladdin.com', movie: bb, password: pw)
User.create!(name: 'Ms. Potts', email: 'mspotts@aladdin.com', movie: bb, password: pw)
User.create!(name: 'Cogsworth', email: 'cogsworth@aladdin.com', movie: bb, password: pw)

# POSTS
Post.destroy_all
Post.create!(body: 'Simbaa, do you see everything the light touches?',
  author_id: User.where(name: 'Mufasa')[0].id,
  receiver_id: User.where(name: 'Simba')[0].id)
Post.create!(body: 'Hakuna Matata, Puumbaa!!',
  author_id: User.where(name: 'Timon')[0].id,
  receiver_id: User.where(name: 'Pumba')[0].id)
Post.create!(body: 'Its our problem free, philosophy',
  author_id: User.where(name: 'Pumba')[0].id,
  receiver_id: User.where(name: 'Timon')[0].id)
# COMMENTS

# FRIENDSHIPS
