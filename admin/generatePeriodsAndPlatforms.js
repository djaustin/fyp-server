db.periods.insert([
  {
       "name": "Daily",
       "key": "day",
       "duration": 86400
   },
   {
       "name": "Weekly",
       "key": "week",
       "duration": 604800
   },
   {
       "name": "Monthly",
       "key": "month",
       "duration": 2592000
   },
   {
       "name": "Yearly",
       "key": "year",
       "duration": 31557600
   }
])

db.platforms.insert([
            {
                "name": "iOS"
            },
            {
                "name": "Android"
            },
            {
                "name": "Windows Phone"
            },
            {
                "name": "Browser"
            },
            {
                "name": "Desktop"
            },
            {
                "name": "Blackberry"
            }
        ])
