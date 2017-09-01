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
User.create!(name: 'Mufasa', email: 'mufasa@lionking.com', movie: lk, password: pw, profilePicUrl: "https://pbs.twimg.com/profile_images/541987353963687936/WR1oaJVu.jpeg", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Sarabi', email: 'sarabi@lionking.com', movie: lk, password: pw, profilePicUrl: "http://orig00.deviantart.net/4e79/f/2008/168/4/d/sarabi_and_simba_by_nienna51.jpg", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Rafiki', email: 'rafiki@lionking.com', movie: lk, password: pw, profilePicUrl: "https://s-media-cache-ak0.pinimg.com/736x/e2/f0/fa/e2f0fa040bf11c644a736f8c3ba5032a.jpg", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Shenzi', email: 'shenzi@lionking.com', movie: lk, password: pw, profilePicUrl: "https://vignette4.wikia.nocookie.net/disney/images/2/2d/Shenzibanzaieddisney.jpeg/revision/latest/scale-to-width-down/350?cb=20120725125315", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Benzai', email: 'benzai@lionking.com', movie: lk, password: pw, profilePicUrl: "https://vignette4.wikia.nocookie.net/disney/images/2/2d/Shenzibanzaieddisney.jpeg/revision/latest/scale-to-width-down/350?cb=20120725125315", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Simba', email: 'simba@lionking.com', movie: lk, password: pw, profilePicUrl: "https://lumiere-a.akamaihd.net/v1/images/character_thelionking_simba_a4161276.jpeg", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Timon', email: 'timon@lionking.com', movie: lk, password: pw, profilePicUrl: "https://vignette4.wikia.nocookie.net/disneyinfinityfanfiction/images/e/e8/Timon.png/revision/latest?cb=20160106032105", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Pumba', email: 'pumba@lionking.com', movie: lk, password: pw, profilePicUrl: "https://disneywildaboutsafety.com/wp-content/uploads/2013/07/parents_chars.png", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Nala', email: 'nala@lionking.com', movie: lk, password: pw, profilePicUrl: "https://lumiere-a.akamaihd.net/v1/images/character_thelionking_nala_7b0cb360.jpeg", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Scar', email: 'scar@lionking.com', movie: lk, password: pw, profilePicUrl: "https://pbs.twimg.com/profile_images/3705744002/324dc6a62abaebdfd446e72545e75568_400x400.jpeg", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Zazu', email: 'zazu@lionking.com', movie: lk, password: pw, profilePicUrl: "https://i.pinimg.com/736x/d0/29/84/d029845f8579d9d2f7f06a17186b3ef9--disney-lion-king-the-lion-king.jpg", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")
User.create!(name: 'Ed', email: 'ed@lionking.com', movie: lk, password: pw, profilePicUrl: "https://vignette4.wikia.nocookie.net/disney/images/2/2d/Shenzibanzaieddisney.jpeg/revision/latest/scale-to-width-down/350?cb=20120725125315", cover_url: "https://coverfiles.alphacoders.com/732/7323.jpg")

# Aladdin
al = 'Aladdin'
User.create!(name: 'Jasmine', email: 'jasmine@aladdin.com', movie: al, password: pw, profilePicUrl: "http://images.hellogiggles.com/uploads/2016/11/02074038/princess-jasmine-700x525.jpg", cover_url: "http://cdn4.thr.com/sites/default/files/2016/02/aladdin_1992_0.jpg")
User.create!(name: 'Aladdin', email: 'aladdin@aladdin.com', movie: al, password: pw, profilePicUrl: "https://vignette1.wikia.nocookie.net/thedescendants/images/f/f0/Angry-aladdin.jpg/revision/latest?cb=20161230164727", cover_url: "http://cdn4.thr.com/sites/default/files/2016/02/aladdin_1992_0.jpg")
User.create!(name: 'Genie', email: 'genie@aladdin.com', movie: al, password: pw, profilePicUrl: "https://img.buzzfeed.com/buzzfeed-static/static/2016-01/21/13/campaign_images/webdr04/how-well-do-you-know-the-genie-from-aladdin-2-5437-1453401463-9_dblbig.jpg", cover_url: "http://cdn4.thr.com/sites/default/files/2016/02/aladdin_1992_0.jpg")
User.create!(name: 'Jafar', email: 'jafar@aladdin.com', movie: al, password: pw, profilePicUrl: "http://pm1.narvii.com/6079/ecd529b26cc9aff21bf046225d80deca992617fe_hq.jpg", cover_url: "http://cdn4.thr.com/sites/default/files/2016/02/aladdin_1992_0.jpg")
User.create!(name: 'Rajah', email: 'rajah@aladdin.com', movie: al, password: pw, profilePicUrl: "https://vignette1.wikia.nocookie.net/aladdin/images/9/98/Rajah.jpg/revision/latest?cb=20130118120530", cover_url: "http://cdn4.thr.com/sites/default/files/2016/02/aladdin_1992_0.jpg")
User.create!(name: 'Iago', email: 'iago@aladdin.com', movie: al, password: pw, profilePicUrl: "https://vignette2.wikia.nocookie.net/disneyanimals/images/3/30/830px-Aladdin-disneyscreencaps.com-4918-1-.jpg/revision/latest?cb=20120316022417", cover_url: "http://cdn4.thr.com/sites/default/files/2016/02/aladdin_1992_0.jpg")
User.create!(name: 'Abu', email: 'abu@aladdin.com', movie: al, password: pw, profilePicUrl: "https://i.pinimg.com/originals/2e/6a/7e/2e6a7e3d2f801d0f331dc9d0e120c410.jpg", cover_url: "http://cdn4.thr.com/sites/default/files/2016/02/aladdin_1992_0.jpg")

# Beauty and the Beast
bb = 'Beauty and the Beast'
User.create!(name: 'Beast', email: 'beast@aladdin.com', movie: bb, password: pw, profilePicUrl: "http://cdn.playbuzz.com/cdn/5e65e7cf-cc06-4566-aa16-ff2be107f0a3/df9ee840-2dd0-4afc-9af1-700c197a9c36.jpg", cover_url: "http://vignette3.wikia.nocookie.net/disney/images/e/ed/Beauty_and_the_Beast_Diamond_Edition_Banner.jpg/revision/latest?cb=20140624154351")
User.create!(name: 'Belle', email: 'belle@aladdin.com', movie: bb, password: pw, profilePicUrl: "https://mbtipopculture.files.wordpress.com/2012/07/belle.jpeg", cover_url: "http://vignette3.wikia.nocookie.net/disney/images/e/ed/Beauty_and_the_Beast_Diamond_Edition_Banner.jpg/revision/latest?cb=20140624154351")
User.create!(name: 'Gaston', email: 'gaston@aladdin.com', movie: bb, password: pw, profilePicUrl: "https://cdn2.hercampus.com/mgid-ao-image-mtv.com-35807.jpeg", cover_url: "http://vignette3.wikia.nocookie.net/disney/images/e/ed/Beauty_and_the_Beast_Diamond_Edition_Banner.jpg/revision/latest?cb=20140624154351")
User.create!(name: 'Lumiere', email: 'lumiere@aladdin.com', movie: bb, password: pw, profilePicUrl: "https://vignette3.wikia.nocookie.net/disney/images/8/8a/Lumi%C3%A8re_in_first_film.jpg/revision/latest?cb=20130829073544", cover_url: "http://vignette3.wikia.nocookie.net/disney/images/e/ed/Beauty_and_the_Beast_Diamond_Edition_Banner.jpg/revision/latest?cb=20140624154351")
User.create!(name: 'Ms. Potts', email: 'mspotts@aladdin.com', movie: bb, password: pw, profilePicUrl: "https://vignette3.wikia.nocookie.net/disney/images/3/3d/Normal_beautyandthebeast_1775.jpg/revision/latest?cb=20110811023923", cover_url: "http://vignette3.wikia.nocookie.net/disney/images/e/ed/Beauty_and_the_Beast_Diamond_Edition_Banner.jpg/revision/latest?cb=20140624154351")
User.create!(name: 'Cogsworth', email: 'cogsworth@aladdin.com', movie: bb, password: pw, profilePicUrl: "https://vignette1.wikia.nocookie.net/disney/images/d/df/Beauty-and-the-beast-disneyscreencaps.com-3825.jpg/revision/latest?cb=20140324041800", cover_url: "http://vignette3.wikia.nocookie.net/disney/images/e/ed/Beauty_and_the_Beast_Diamond_Edition_Banner.jpg/revision/latest?cb=20140624154351")

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
  Post.create!(body: 'I laguh in the face of danger! HAHAHAHA',
  author_id: User.where(name: 'Simba')[0].id,
  receiver_id: User.where(name: 'Nala')[0].id)
Post.create!(body: 'Be.. ourr.... gueesssttt',
  author_id: User.where(name: 'Lumiere')[0].id,
  receiver_id: User.where(name: 'Belle')[0].id)
Post.create!(body: 'Do you trust me??',
  author_id: User.where(name: 'Aladdin')[0].id,
  receiver_id: User.where(name: 'Jasmine')[0].id)
Post.create!(body: 'All you gotta do is rub that lamp!',
  author_id: User.where(name: 'Genie')[0].id,
  receiver_id: User.where(name: 'Aladdin')[0].id)
Post.create!(body: 'Who does that beast think he is!?',
  author_id: User.where(name: 'Gaston')[0].id,
  receiver_id: User.where(name: 'Gaston')[0].id)
Post.create!(body: 'Enter, the cave of wonderrss!',
  author_id: User.where(name: 'Jafar')[0].id,
  receiver_id: User.where(name: 'Aladdin')[0].id)
Post.create!(body: 'You\'re not even a real prince...',
  author_id: User.where(name: 'Jasmine')[0].id,
  receiver_id: User.where(name: 'Aladdin')[0].id)
Post.create!(body: 'Oh yeah Jafar, great idea!! Mwahaha',
  author_id: User.where(name: 'Iago')[0].id,
  receiver_id: User.where(name: 'Jafar')[0].id)
Post.create!(body: 'Bring me the lamp!!',
  author_id: User.where(name: 'Jafar')[0].id,
  receiver_id: User.where(name: 'Aladdin')[0].id)
Post.create!(body: 'uh uh ih ih -- awhhh',
  author_id: User.where(name: 'Abu')[0].id,
  receiver_id: User.where(name: 'Aladdin')[0].id)
Post.create!(body: 'Asante sana squash banana!',
  author_id: User.where(name: 'Rafiki')[0].id,
  receiver_id: User.where(name: 'Rafiki')[0].id)
Post.create!(body: 'The question is: who are you?',
  author_id: User.where(name: 'Rafiki')[0].id,
  receiver_id: User.where(name: 'Simba')[0].id)

# COMMENTS
Comment.destroy_all
Comment.create!(body: 'Yes, dad?', author_id: User.where(name: 'Simba')[0].id, post: Post.where(body: 'Simbaa, do you see everything the light touches?')[0])
Comment.create!(body: 'Dont do it Aladdin!! I saw the movie!', author_id: User.where(name: 'Mufasa')[0].id, post: Post.where(body: 'Enter, the cave of wonderrss!')[0])
Comment.create!(body: 'Hey, loved your song... roar!', author_id: User.where(name: 'Mufasa')[0].id, post: Post.where(body: 'Be.. ourr.... gueesssttt')[0])
Comment.create!(body: 'No, Simba! Dont!!', author_id: User.where(name: 'Nala')[0].id, post: Post.where(body: 'I laguh in the face of danger! HAHAHAHA')[0])
Comment.create!(body: 'hahAHhAhAhHAhaHihihIhihHihiHiI', author_id: User.where(name: 'Ed')[0].id, post: Post.where(body: 'I laguh in the face of danger! HAHAHAHA')[0])
Comment.create!(body: 'Aww, man... you had to do it!!??', author_id: User.where(name: 'Nala')[0].id, post: Post.where(body: 'I laguh in the face of danger! HAHAHAHA')[0])
Comment.create!(body: 'HIhihhIhIHAHA', author_id: User.where(name: 'Shenzi')[0].id, post: Post.where(body: 'I laguh in the face of danger! HAHAHAHA')[0])
Comment.create!(body: 'uhAHuHAUhUAHuaihaiha', author_id: User.where(name: 'Benzai')[0].id, post: Post.where(body: 'I laguh in the face of danger! HAHAHAHA')[0])

# FRIENDSHIPSs
Friendship.destroy_all
Friendship.create!(friendee_id: User.where(name: 'Mufasa')[0].id, friender_id: User.where(name: 'Simba')[0].id, status: 'pending')
Friendship.create!(friendee_id: User.where(name: 'Mufasa')[0].id, friender_id: User.where(name: 'Nala')[0].id, status: 'accepted')
Friendship.create!(friendee_id: User.where(name: 'Mufasa')[0].id, friender_id: User.where(name: 'Abu')[0].id, status: 'accepted')
Friendship.create!(friendee_id: User.where(name: 'Rafiki')[0].id, friender_id: User.where(name: 'Aladdin')[0].id, status: 'accepted')
Friendship.create!(friendee_id: User.where(name: 'Rafiki')[0].id, friender_id: User.where(name: 'Genie')[0].id, status: 'accepted')
Friendship.create!(friendee_id: User.where(name: 'Rafiki')[0].id, friender_id: User.where(name: 'Simba')[0].id, status: 'pending')
Friendship.create!(friendee_id: User.where(name: 'Rafiki')[0].id, friender_id: User.where(name: 'Iago')[0].id, status: 'accepted')
Friendship.create!(friendee_id: User.where(name: 'Rafiki')[0].id, friender_id: User.where(name: 'Nala')[0].id, status: 'accepted')
Friendship.create!(friendee_id: User.where(name: 'Rafiki')[0].id, friender_id: User.where(name: 'Abu')[0].id, status: 'pending')
