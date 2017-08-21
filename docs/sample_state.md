{
      session: {		
        currentUser:  {
        		id: 1,
        		name: ‘Mashu Duek’
        		post_ids: [1,2,3]
        	  friends_ids: [2,3,4,5]
        	  dob: 01/25/1991
        	  sex: ‘M’
        }
      },
      entities: {
            posts: {
		              1: {
                    id:  1,
       	            body: ‘I am a post’,
			              author_id: 1,
	                  comment_ids: [1,2,3]
                    },
                  2: {
	                  id: 2,
	                  body: ‘I am also a post’,
	                  author_id: 1,
	                  comment_ids: [4,5,6]
                    },
            }
            comments: {
		              1: {
				            id: 1,
	                  body: ‘I am comment’,
				            post_id: 2,
	                  author_id: 1
                    },
                  2: {
		                id: 2,
	                  body: ‘lol, so am I’,
		                post_id: 2,
	                  author_id: 2
                  }
            }

        users: {
	           1: {
			            id: 1,
			            name: ‘Mashu Duek’
			            post_ids: [1,2,3]
		              friends_ids: [2,3,4,5]
                }
		         2: {
			            id: 2,
			            name: ‘Tomi Duek’
			            post_ids: [4,5,6]
			            friends_ids: [1, 3,4,5,6]
	               }
          }
      }
}
