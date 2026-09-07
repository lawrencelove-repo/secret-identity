/**
 * Seed list of celebrities / pop-culture characters.
 * Add more entries over time — boxes pull random picks per round.
 *
 * Optional fields:
 *   category / categories — one string, slash-separated string, or string array.
 *     Multiple values limit deals per type and display joined with "/".
 *   description — short label (often a franchise/title) where brevity matters
 *   longDescription — longer clue-helper text shown on the character card
 *   disabled    — when true, excluded from dealing into the game
 */
const CHARACTERS = [
  { name: "Ariana Grande", category: "Singer/Musician", longDescription: "American pop singer and actress known for her powerful high notes, signature ponytail, and hits from the 2010s onward." },
  { name: "Joan of Arc", category: "Historical figure", longDescription: "Teenage French heroine who said divine visions guided her to lead troops during the Hundred Years' War." },
  { name: "Ted Lasso", category: "TV character", longDescription: "Cheerful American football coach hired to manage an English soccer team, known for optimism, kindness, and a prominent mustache." },
  { name: "Sonic", category: "Cartoon character", longDescription: "Super-fast blue video game hedgehog who collects golden rings and battles the scheming Doctor Eggman." },
  { name: "Buzz Lightyear", category: "Movie character", description: "Toy Story", longDescription: "Space ranger action figure from Toy Story who initially believes he is a real intergalactic hero." },
  { name: "Peter Pan", category: "Literary character", longDescription: "Forever-young boy from Neverland who can fly, battles Captain Hook, and befriends the Darling children." },
  { name: "Betty Boop", category: "Cartoon character", longDescription: "Flirty, big-eyed cartoon singer from the 1930s, recognizable by her short curls and playful jazz-age style." },
  { name: "Wednesday Addams", category: "TV character", description: "The Addams Family", longDescription: "Deadpan daughter from The Addams Family, known for dark braids, gothic tastes, and a fascination with the macabre." },
  { name: "Carrie Bradshaw", category: "TV character", description: "Sex and the City", longDescription: "Fashion-loving New York columnist from Sex and the City who writes about romance, friendship, and modern dating." },
  { name: "Sherlock Holmes", category: "Literary character", longDescription: "Brilliant London detective created by Arthur Conan Doyle, famous for deduction, a deerstalker hat, and partner Doctor Watson." },
  { name: "Wonder Woman", category: "Comic character", longDescription: "Amazon warrior and DC superhero who wields a truth-compelling lasso, wears powerful bracelets, and champions justice." },
  { name: "Elvis Presley", category: "Singer/Musician", longDescription: "Rock-and-roll icon called the King, known for swiveling hips, a pompadour, and flashy Las Vegas jumpsuits." },
  { name: "Darth Vader", category: "Movie character", description: "Star Wars", longDescription: "Black-armored Star Wars villain with mechanical breathing, a red lightsaber, and a powerful connection to the Force." },
  { name: "Hermione Granger", category: "Literary character", description: "Harry Potter", longDescription: "Exceptionally clever Hogwarts student from Harry Potter, known for diligent studying, quick spellwork, and loyalty to her friends." },
  { name: "SpongeBob SquarePants", category: "Cartoon character", longDescription: "Cheerful yellow sea sponge who works at the Krusty Krab and lives in a pineapple under the sea." },
  { name: "Cleopatra", category: "Historical figure", longDescription: "Last active pharaoh of ancient Egypt, remembered for political skill and alliances with Julius Caesar and Mark Antony." },
  { name: "Tony Stark", category: "Movie character", description: "Iron Man", longDescription: "Billionaire inventor behind Iron Man, known for advanced armored suits, sharp wit, and membership in the Avengers." },
  { name: "Lara Croft", category: "Video game character", longDescription: "Athletic archaeologist and Tomb Raider heroine who explores ancient ruins, solves puzzles, and survives dangerous adventures." },
  { name: "Mickey Mouse", category: "Cartoon character", longDescription: "Disney's cheerful cartoon mouse, recognizable by round ears, red shorts, white gloves, and longtime companion Minnie." },
  { name: "Beyoncé", category: "Singer/Musician", longDescription: "Grammy-winning singer and former Destiny's Child member known for commanding performances, elaborate visuals, and empowering pop anthems." },
  { name: "James Bond", category: "Movie character", longDescription: "Suave British secret agent designated 007, known for gadgets, tailored suits, daring missions, and distinctive drink preferences." },
  { name: "Katniss Everdeen", category: "Literary character", description: "The Hunger Games", longDescription: "Skilled archer from The Hunger Games who volunteers for her sister and becomes a symbol of rebellion." },
  { name: "Pikachu", category: "Cartoon character", longDescription: "Ash's yellow electric Pokémon companion, recognizable by red cheeks, pointed ears, and lightning-shaped tail." },
  { name: "Napoleon Bonaparte", category: "Historical figure", longDescription: "French military leader who became emperor, conquered much of Europe, and met final defeat at Waterloo." },
  { name: "Black Panther", category: "Comic character", description: "Marvel", longDescription: "Marvel superhero and king of Wakanda who wears a vibranium suit and protects his technologically advanced nation." },
  { name: "Moana", category: "Movie character", longDescription: "Adventurous Polynesian wayfinder chosen by the ocean to sail beyond her island and restore a stolen heart." },
  { name: "Walter White", category: "TV character", description: "Breaking Bad", longDescription: "Breaking Bad chemistry teacher who enters the illegal drug trade, adopting a hat-wearing alter ego called Heisenberg." },
  { name: "Mario", category: "Video game character", longDescription: "Mustached Nintendo plumber who jumps through the Mushroom Kingdom, rescues Princess Peach, and often battles Bowser." },
  { name: "Frida Kahlo", category: "Historical figure", longDescription: "Mexican painter celebrated for vivid self-portraits, floral hairstyles, traditional clothing, and explorations of identity and pain." },
  { name: "Captain America", category: "Comic character", longDescription: "Marvel's shield-carrying super-soldier, a World War II hero known for patriotism, leadership, and unwavering principles." },
  { name: "Elle Woods", category: "Movie character", description: "Legally Blonde", longDescription: "Fashionable sorority graduate from Legally Blonde who attends Harvard Law School and proves her intelligence and determination." },
  { name: "Goku", category: "Cartoon character", description: "Dragon Ball", longDescription: "Cheerful Saiyan warrior from Dragon Ball who trains constantly, fires energy blasts, and transforms to face stronger opponents." },
  { name: "Taylor Swift", category: "Singer/Musician", longDescription: "Singer-songwriter known for autobiographical lyrics, musical reinventions, devoted fans, and record-breaking stadium tours." },
  { name: "Indiana Jones", category: "Movie character", longDescription: "Fedora-wearing archaeologist and adventurer who carries a whip, hunts legendary artifacts, and dislikes snakes." },
  { name: "Daenerys Targaryen", category: "TV character", description: "Game of Thrones", longDescription: "Exiled princess from Game of Thrones who commands dragons and seeks the Iron Throne." },
  { name: "Link", category: "Video game character", description: "The Legend of Zelda", longDescription: "Green-clad hero from The Legend of Zelda who wields the Master Sword and repeatedly saves Hyrule." },
  { name: "Marilyn Monroe", category: "Movie/TV Actress", longDescription: "1950s Hollywood star and glamour icon known for platinum curls, comedic roles, and a famous billowing white dress." },
  { name: "Batman", category: "Comic character", longDescription: "Gotham's masked vigilante, a wealthy detective who uses gadgets, martial arts, and a bat-themed identity to fight crime." },
  { name: "Dorothy Gale", category: "Literary character", description: "The Wizard of Oz", longDescription: "Kansas girl swept by a tornado into Oz, where ruby slippers and a yellow brick road guide her journey home." },
  { name: "Shrek", category: "Movie character", longDescription: "Grumpy green ogre who lives in a swamp, befriends a talkative donkey, and falls for Princess Fiona." },
  { name: "Abraham Lincoln", category: "Historical figure", longDescription: "Sixteenth U.S. president who led the nation through the Civil War and issued the Emancipation Proclamation." },
  { name: "Achilles", category: "Literary character", longDescription: "Nearly invulnerable Greek warrior of the Trojan War whose single weak spot was his heel." },
  { name: "Adolf Hitler", category: "Historical figure", longDescription: "Nazi dictator of Germany whose expansionism and racist regime caused World War II and the Holocaust." },
  { name: "Agatha Christie", category: "Author", longDescription: "British mystery author who created detectives Hercule Poirot and Miss Marple and wrote many ingenious whodunits." },
  { name: "Al Capone", category: "Historical figure", longDescription: "Notorious Chicago gangster of the Prohibition era, associated with speakeasies, organized crime, and an eventual tax conviction." },
  { name: "Albert Einstein", category: "Historical figure", longDescription: "Theoretical physicist famous for relativity, the equation linking mass and energy, and his unmistakable wild hair." },
  { name: "Alexa", category: "Brand/Mascot", description: "Amazon", longDescription: "Amazon's voice-controlled virtual assistant, commonly heard through Echo smart speakers answering questions and managing connected homes." },
  { name: "Alfred Hitchcock", category: "Director", longDescription: "Master of suspense who directed Psycho, Vertigo, and The Birds, and made playful cameos in his films." },
  { name: "Alice", category: "Literary character", description: "Alice in Wonderland", longDescription: "Curious girl who follows a white rabbit into Wonderland, meeting a grinning cat, a mad tea party, and a volatile queen." },
  { name: "Amelia Earhart", category: "Historical figure", longDescription: "Pioneering American aviator and first woman to fly solo across the Atlantic, who later vanished over the Pacific." },
  { name: "Angela Merkel", category: "Historical figure", longDescription: "German chancellor from 2005 to 2021, known for steady leadership and major influence within the European Union." },
  { name: "Angelina Jolie", category: "Movie/TV Actress", longDescription: "Hollywood actress known for Tomb Raider and Maleficent, as well as humanitarian work and a high-profile public life." },
  { name: "Anne Frank", category: "Historical figure", longDescription: "Jewish teenager whose diary documented hiding from Nazi persecution in Amsterdam during World War II." },
  { name: "Aphrodite", category: "Literary character", longDescription: "Greek goddess of love and beauty, traditionally said to have arisen from sea foam." },
  { name: "Arnold Schwarzenegger", category: "Movie/TV Actor", longDescription: "Austrian-born bodybuilder turned action star and California governor, closely associated with The Terminator." },
  { name: "Arya Stark", category: "TV character", description: "Game of Thrones", longDescription: "Independent young fighter from Game of Thrones who trains in swordplay, travels in disguise, and keeps a list of enemies." },
  { name: "Attila", category: "Historical figure", longDescription: "Fifth-century ruler of the Huns, feared across the Roman world for his powerful mounted armies." },
  { name: "Audrey Hepburn", category: "Movie/TV Actress", longDescription: "Elegant Hollywood actress known for Breakfast at Tiffany's, a black dress and pearls, and later humanitarian work." },
  { name: "Awkwafina", category: "Singer/Actress", longDescription: "American comedian, rapper, and actress known for a distinctive raspy voice and roles in Crazy Rich Asians and Shang-Chi." },
  { name: "Babe Ruth", category: "Historical figure", longDescription: "Legendary New York Yankees slugger nicknamed the Bambino, one of baseball's earliest home-run superstars." },
  { name: "Bambi", category: "Cartoon character", longDescription: "Young Disney deer who grows up in the forest alongside friends Thumper the rabbit and Flower the skunk." },
  { name: "Barack Obama", category: "Historical figure", longDescription: "Forty-fourth U.S. president and first Black person to hold the office, known for a message of hope and change." },
  { name: "Barbie", category: "Movie character", longDescription: "Iconic fashion doll turned movie heroine, known for countless careers, a pink dreamhouse, and companion Ken." },
  { name: "Beethoven", category: "Historical figure", longDescription: "German composer who wrote famous symphonies despite losing his hearing, including the instantly recognizable Fifth." },
  { name: "Bigfoot", category: "Literary character", longDescription: "Legendary large, hairy ape-like creature reportedly seen in North American forests, especially the Pacific Northwest." },
  { name: "Bilbo", category: "Literary character", description: "The Hobbit", longDescription: "Comfort-loving hobbit from The Hobbit who leaves the Shire, meets Gollum, and finds a mysterious golden ring." },
  { name: "Bill Gates", category: "Businessperson", longDescription: "Microsoft cofounder who helped popularize personal computing and later became a major global philanthropist." },
  { name: "Billy the Kid", category: "Historical figure", longDescription: "Young outlaw and gunslinger of the American Old West, surrounded by legends about his escapes and short life." },
  { name: "Blackbeard", category: "Historical figure", longDescription: "Infamous early-18th-century pirate who cultivated a terrifying appearance with a huge dark beard and smoking fuses." },
  { name: "Bob Ross", category: "TV Personality", longDescription: "Gentle-voiced television painter who created quick landscapes, encouraged beginners, and welcomed accidental little trees." },
  { name: "Bridget Jones", category: "Movie character", longDescription: "Single Londoner who records romantic mishaps, career struggles, and self-improvement efforts in her famously candid diary." },
  { name: "Britney Spears", category: "Singer/Musician", longDescription: "Pop superstar who rose as a teenage sensation, known for elaborate performances and defining hits of the late 1990s." },
  { name: "Bruce Lee", category: "Historical figure", longDescription: "Martial artist and film star whose speed, philosophy, and yellow jumpsuit made him a global action icon." },
  { name: "Buffy Summers", category: "TV character", description: "Buffy the Vampire Slayer", longDescription: "Teenage heroine of Buffy the Vampire Slayer who balances school and friendships with secretly battling supernatural threats." },
  { name: "Bugs Bunny", category: "Cartoon character", longDescription: "Wisecracking Looney Tunes rabbit who munches carrots and calmly outsmarts hunters such as Elmer Fudd." },
  { name: "Calamity Jane", category: "Historical figure", longDescription: "Colorful frontierswoman of the American Old West, remembered as a sharpshooter and associate of Wild Bill Hickok." },
  { name: "Calvin Klein", category: "Businessperson", longDescription: "American fashion designer whose name became famous on minimalist clothing, underwear waistbands, fragrances, and provocative advertisements." },
  { name: "Catwoman", category: "Comic character", longDescription: "Feline-themed DC burglar and antihero who uses a whip, moves acrobatically, and shares a complicated bond with Batman." },
  { name: "Cersei Lannister", category: "TV character", description: "Game of Thrones", longDescription: "Ambitious Game of Thrones queen fiercely protective of her children and determined to control the Iron Throne." },
  { name: "Charlie Chaplin", category: "Historical figure", longDescription: "Silent-film comedy legend who played the bowler-hatted Little Tramp with a cane, mustache, and distinctive walk." },
  { name: "Cher", category: "Singer/Actress", longDescription: "Singer and actress called the Goddess of Pop, known for a deep voice, flamboyant costumes, and decades of reinvention." },
  { name: "Chester the Cheetah", category: "Cartoon character", longDescription: "Sunglasses-wearing cartoon cheetah mascot who enthusiastically promotes Cheetos and their orange, cheesy crunch." },
  { name: "Chris Rock", category: "Comedian", longDescription: "American stand-up comedian and actor known for energetic social commentary and a sharp, unmistakable delivery." },
  { name: "Christopher Columbus", category: "Historical figure", longDescription: "Italian navigator whose 1492 Atlantic voyage for Spain reached the Caribbean, beginning sustained European colonization of the Americas." },
  { name: "Cinderella", category: "Movie character", longDescription: "Fairy-tale heroine transformed for a royal ball, recognizable by a glass slipper, pumpkin carriage, and midnight deadline." },
  { name: "Cindy Crawford", category: "Model", longDescription: "American supermodel of the 1980s and 1990s, recognizable by the beauty mark above her lip." },
  { name: "Clint Eastwood", category: "Movie/TV Actor", longDescription: "Actor and director known for stoic Western gunslingers, the Dirty Harry films, and a famously tough screen presence." },
  { name: "Condoleezza Rice", category: "Historical figure", longDescription: "American diplomat who served as national security adviser and became the first Black woman to serve as secretary of state." },
  { name: "Cristiano Ronaldo", category: "Athlete", longDescription: "Portuguese soccer superstar known for prolific scoring, athletic celebrations, the number seven, and success across top European clubs." },
  { name: "Céline Dion", category: "Singer/Musician", longDescription: "Canadian powerhouse singer known for soaring ballads, Las Vegas residencies, and Titanic's signature love theme." },
  { name: "Daisy Duck", category: "Cartoon character", longDescription: "Disney duck with a bow, heels, and strong personality, best known as Donald Duck's girlfriend." },
  { name: "Dalai Lama", category: "Historical figure", longDescription: "Title of Tibet's spiritual leader, most associated today with a Nobel Peace Prize winner who advocates compassion and nonviolence." },
  { name: "Dale Earnhardt", category: "Athlete", longDescription: "Seven-time NASCAR champion nicknamed the Intimidator, famous for driving the black number three car." },
  { name: "David Bowie", category: "Singer/Musician", longDescription: "British rock innovator known for constant reinvention, the Ziggy Stardust persona, theatrical fashion, and songs about space." },
  { name: "Dexter Morgan", category: "TV character", description: "Dexter", longDescription: "Forensic blood analyst from Dexter who secretly targets dangerous criminals while carefully maintaining an ordinary public life." },
  { name: "Django", category: "Movie character", description: "Django Unchained", longDescription: "Freed bounty hunter from Django Unchained who searches the American South for his wife with help from a German marksman." },
  { name: "Doctor Who", category: "TV character", longDescription: "Time-traveling alien known as the Doctor who regenerates into new faces and explores space in a blue police box." },
  { name: "Dolly Parton", category: "Singer/Actress", longDescription: "Country music legend known for big blonde hair, sparkling outfits, warm humor, songwriting, and generous literacy programs." },
  { name: "Don Corleone", category: "Movie character", description: "The Godfather", longDescription: "Aging Mafia patriarch from The Godfather, known for quiet authority, family loyalty, and making hard-to-refuse proposals." },
  { name: "Dora the Explorer", category: "Cartoon character", longDescription: "Bilingual cartoon adventurer who carries a talking backpack, follows a map, and asks young viewers to help solve problems." },
  { name: "Dracula", category: "Literary character", longDescription: "Transylvanian vampire count from Bram Stoker's novel, associated with a castle, bats, fangs, and an aversion to sunlight." },
  { name: "E.T. the Extra-Terrestrial", category: "Movie character", longDescription: "Gentle stranded alien who befriends a boy named Elliott and tries to contact home, famously traveling by flying bicycle." },
  { name: "Edward Scissorhands", category: "Movie character", longDescription: "Shy artificial man with blades for fingers who trims hedges beautifully but struggles to fit into suburban life." },
  { name: "Elizabeth II", category: "Historical figure", longDescription: "Britain's longest-reigning monarch, recognizable by colorful hats, corgis, and more than seventy years on the throne." },
  { name: "Ellen DeGeneres", category: "TV Personality", longDescription: "American comedian and longtime daytime talk-show host known for celebrity interviews, giveaways, and dancing with her audience." },
  { name: "Ellen Ripley", category: "Movie character", description: "Alien", longDescription: "Resourceful space officer from Alien who confronts a deadly extraterrestrial creature and becomes a defining science-fiction heroine." },
  { name: "Elon Musk", category: "Businessperson", longDescription: "Technology entrepreneur associated with Tesla electric cars, SpaceX rockets, and the social platform formerly called Twitter." },
  { name: "Elsa", category: "Movie character", description: "Frozen", longDescription: "Ice-powered queen from Frozen whose emotions create a magical winter and whose bond with sister Anna drives the story." },
  { name: "Eminem", category: "Singer/Musician", longDescription: "Detroit rapper also called Slim Shady, known for rapid wordplay, autobiographical lyrics, and the film 8 Mile." },
  { name: "Eric Cartman", category: "Cartoon character", description: "South Park", longDescription: "Selfish, manipulative fourth-grader from South Park, recognizable by his red jacket, blue hat, and outrageous schemes." },
  { name: "Forrest Gump", category: "Movie character", longDescription: "Kindhearted Alabama man who unexpectedly witnesses major American events, excels at running, and often reflects on life's unpredictability." },
  { name: "Frank Sinatra", category: "Singer/Actor", longDescription: "Smooth-voiced singer and actor associated with the Rat Pack, tailored suits, and classic songs about New York." },
  { name: "Frankenstein", category: "Literary character", longDescription: "Victor Frankenstein is the scientist who creates life from assembled remains; the name is often mistakenly given to his creature." },
  { name: "Freddie Mercury", category: "Singer/Musician", longDescription: "Queen's flamboyant lead singer, celebrated for a huge vocal range, commanding stage presence, and iconic Live Aid performance." },
  { name: "Gandalf", category: "Literary character", description: "The Lord of the Rings", longDescription: "Wise, staff-carrying wizard from The Lord of the Rings who guides hobbits and confronts dark forces across Middle-earth." },
  { name: "Gandhi", category: "Historical figure", longDescription: "Indian independence leader who championed nonviolent resistance, recognizable by round glasses, simple clothing, and a walking staff." },
  { name: "Garfield", category: "Cartoon character", longDescription: "Orange comic-strip cat who loves lasagna, hates Mondays, and tolerates his owner Jon and dog companion Odie." },
  { name: "General Robert E. Lee", category: "Historical figure", longDescription: "Confederate general who commanded the Army of Northern Virginia during the American Civil War and surrendered at Appomattox." },
  { name: "George Foreman", category: "Athlete", longDescription: "Two-time heavyweight boxing champion who later became equally famous for a countertop grilling appliance bearing his name." },
  { name: "George Lucas", category: "Director", longDescription: "Filmmaker who created Star Wars and cofounded the effects company behind many landmark movie spectacles." },
  { name: "God", category: "Literary character", longDescription: "Supreme divine being in monotheistic religions, commonly described as creator of the universe, all-knowing, and all-powerful." },
  { name: "Godzilla", category: "Movie character", longDescription: "Enormous Japanese movie monster resembling a radioactive dinosaur, famous for roaring, breathing atomic energy, and flattening city skylines." },
  { name: "Gollum", category: "Literary character", description: "The Lord of the Rings", longDescription: "Twisted cave-dweller from The Lord of the Rings, obsessed with a golden ring he calls his precious possession." },
  { name: "Gordon Ramsay", category: "TV Personality", longDescription: "Celebrity chef known for Michelin-starred restaurants, intense cooking-show critiques, and fiery reactions to kitchen mistakes." },
  { name: "Greta Thunberg", category: "Activist", longDescription: "Swedish climate activist who began school strikes as a teenager and challenged world leaders to act urgently." },
  { name: "Groot", category: "Movie character", description: "Guardians of the Galaxy", longDescription: "Tree-like Guardian of the Galaxy with a tiny vocabulary, great strength, and the ability to regrow from a twig." },
  { name: "Guy Fieri", category: "TV Personality", longDescription: "Spiky-haired food television host who drives a red convertible while visiting diners and celebrating bold comfort food." },
  { name: "H.P. Lovecraft", category: "Author", longDescription: "Early-20th-century horror author whose cosmic tales feature ancient unknowable beings, including the tentacled Cthulhu." },
  { name: "Halle Berry", category: "Movie/TV Actress", longDescription: "Oscar-winning actress known for Monster's Ball, playing Storm in X-Men, and appearing as a Bond girl." },
  { name: "Hannibal Lecter", category: "Movie character", longDescription: "Brilliant, cultured imprisoned psychiatrist from The Silence of the Lambs who unnervingly assists an FBI investigation." },
  { name: "Harry Potter", category: "Literary character", longDescription: "Bespectacled boy wizard with a lightning-shaped scar who attends Hogwarts and faces the dark wizard Voldemort." },
  { name: "Hayao Miyazaki", category: "Director", description: "Studio Ghibli", longDescription: "Japanese animator and Studio Ghibli cofounder behind Spirited Away, Totoro, and richly imaginative hand-drawn worlds." },
  { name: "Henry Ford", category: "Historical figure", longDescription: "American automaker who popularized assembly-line production and made the Model T affordable to a mass market." },
  { name: "Hercules", category: "Literary character", longDescription: "Hero of Greek mythology famed for extraordinary strength and twelve difficult labors imposed upon him." },
  { name: "Hillary Clinton", category: "Historical figure", longDescription: "American politician who served as first lady, senator, secretary of state, and 2016 Democratic presidential nominee." },
  { name: "Homer Simpson", category: "Cartoon character", longDescription: "Bald, doughnut-loving father from The Simpsons who works at a nuclear plant and frequently causes comic disasters." },
  { name: "Howard Stern", category: "TV Personality", longDescription: "Provocative American radio host known for candid celebrity interviews and a long-running, boundary-pushing talk show." },
  { name: "Hulk", category: "Comic character", longDescription: "Marvel hero who transforms from scientist Bruce Banner into a huge green powerhouse when angered." },
  { name: "Iron Man", category: "Comic character", longDescription: "Armored Marvel superhero powered by Tony Stark's engineering genius, recognizable by red-and-gold armor and glowing chest technology." },
  { name: "Isaac Newton", category: "Historical figure", longDescription: "English scientist who formulated laws of motion and gravity, famously linked to the story of a falling apple." },
  { name: "J.K. Rowling", category: "Author", longDescription: "British author who created Harry Potter, Hogwarts, and the wider Wizarding World book series." },
  { name: "Jack Dawson", category: "Movie character", description: "Titanic", longDescription: "Free-spirited young artist from Titanic who wins passage aboard the ship and falls in love with Rose." },
  { name: "Jack Sparrow", category: "Movie character", description: "Pirates of the Caribbean", longDescription: "Eccentric pirate captain from Pirates of the Caribbean, known for a tricorn hat, swaying walk, compass, and clever escapes." },
  { name: "Jack the Ripper", category: "Historical figure", longDescription: "Unidentified killer associated with a series of notorious crimes in Victorian London's Whitechapel district." },
  { name: "Jackie Kennedy", category: "Historical figure", longDescription: "Stylish first lady married to John F. Kennedy, remembered for White House restoration and iconic 1960s fashion." },
  { name: "James Corden", category: "TV Personality", longDescription: "British actor and television host known for The Late Late Show and celebrity singalongs filmed inside a car." },
  { name: "Jane Austen", category: "Historical figure", longDescription: "English novelist whose witty social romances include Pride and Prejudice, Sense and Sensibility, and Emma." },
  { name: "Jason Bourne", category: "Movie character", longDescription: "Highly trained spy with memory loss who uncovers his identity while evading intelligence agencies across the Bourne films." },
  { name: "Jeff Bezos", category: "Businessperson", longDescription: "Amazon founder who built an online bookstore into a global retail giant and later pursued private spaceflight." },
  { name: "Jessica Rabbit", category: "Movie character", description: "Who Framed Roger Rabbit", longDescription: "Glamorous red-haired cartoon nightclub singer from Who Framed Roger Rabbit, married to the goofy title character." },
  { name: "Joe Biden", category: "Historical figure", longDescription: "Forty-sixth U.S. president, longtime Delaware senator, and former vice president under Barack Obama." },
  { name: "Joe Goldberg", category: "TV character", description: "You", longDescription: "Charming bookstore manager from You whose romantic obsessions hide stalking, manipulation, and an increasingly dangerous double life." },
  { name: "John Cleese", category: "Movie/TV Actor", description: "Monty Python", longDescription: "Tall British comedian and Monty Python member known for absurd sketches and the chaotic hotel sitcom Fawlty Towers." },
  { name: "John Fitzgerald Kennedy", category: "Historical figure", longDescription: "Thirty-fifth U.S. president, associated with the space race, Cuban Missile Crisis, and his 1963 assassination in Dallas." },
  { name: "John Lennon", category: "Singer/Musician", longDescription: "Beatles singer-songwriter and peace activist known for round glasses, imaginative solo music, and partnership with Yoko Ono." },
  { name: "Jon Snow", category: "TV character", description: "Game of Thrones", longDescription: "Brooding Game of Thrones hero raised as a Stark outsider who joins the Night's Watch and fights beyond the Wall." },
  { name: "Joseph Stalin", category: "Historical figure", longDescription: "Soviet dictator who ruled through forced industrialization, purges, propaganda, and wartime leadership against Nazi Germany." },
  { name: "Josephine Baker", category: "Historical figure", longDescription: "American-born dancer who became a Paris sensation, aided the French Resistance, and supported civil rights." },
  { name: "Judge Dredd", category: "Comic character", longDescription: "Helmeted comic-book law enforcer in futuristic Mega-City One who acts as police officer, judge, and sentencer." },
  { name: "Julia Child", category: "TV Personality", longDescription: "Joyful, tall American television cook who introduced French cuisine to home audiences with warmth and fearless technique." },
  { name: "Julia Roberts", category: "Movie/TV Actress", longDescription: "Hollywood actress known for her wide smile and leading roles in Pretty Woman, Notting Hill, and Erin Brockovich." },
  { name: "Juliet Capulet", category: "Literary character", description: "Romeo and Juliet", longDescription: "Teenage heroine of Romeo and Juliet who falls for a young man from her family's rival household." },
  { name: "Julius Caesar", category: "Historical figure", longDescription: "Roman general and dictator who conquered Gaul, crossed the Rubicon, and was assassinated by senators in March." },
  { name: "Katy Perry", category: "Singer/Musician", longDescription: "Colorful pop singer known for playful costumes, candy-themed visuals, and energetic anthems about confidence and California." },
  { name: "Kermit the Frog", category: "TV character", longDescription: "Green Muppet leader and performer who plays banjo, hosts shows, and manages a lovable troupe's chaos." },
  { name: "Kim Jong-un", category: "Historical figure", longDescription: "North Korean leader known for the country's nuclear program, tightly controlled government, and distinctive haircut." },
  { name: "Kim Kardashian", category: "TV Personality", longDescription: "Reality television and social-media celebrity who rose through Keeping Up with the Kardashians and built beauty and shapewear businesses." },
  { name: "King Arthur", category: "Literary character", longDescription: "Legendary British ruler who draws a sword from stone, leads Camelot, and gathers knights around the Round Table." },
  { name: "King Kong", category: "Movie character", longDescription: "Giant movie ape taken from a mysterious island to New York, famously climbing the Empire State Building." },
  { name: "Kool-Aid Man", category: "Cartoon character", longDescription: "Giant red drink-pitcher mascot who bursts dramatically through walls to deliver fruit-flavored refreshments." },
  { name: "Kurt Cobain", category: "Singer/Musician", longDescription: "Nirvana frontman and defining voice of 1990s grunge, known for raw songwriting, blond hair, and a striped sweater." },
  { name: "Lady Godiva", category: "Historical figure", longDescription: "English noblewoman of legend who rode unclothed through Coventry to persuade her husband to reduce harsh taxes." },
  { name: "Lance Armstrong", category: "Athlete", longDescription: "American cyclist who won seven Tours de France before losing the titles after admitting performance-enhancing drug use." },
  { name: "Larry Bird", category: "Athlete", longDescription: "Boston Celtics basketball legend known for elite shooting, fierce competitiveness, and a celebrated rivalry with Magic Johnson." },
  { name: "Leonardo da Vinci", category: "Historical figure", longDescription: "Renaissance polymath who painted the Mona Lisa and The Last Supper while designing inventions far ahead of his era." },
  { name: "Leonardo DiCaprio", category: "Movie/TV Actor", longDescription: "Hollywood actor known for Titanic, Inception, and The Revenant, as well as environmental advocacy." },
  { name: "Lightning McQueen", category: "Movie character", description: "Cars", longDescription: "Red rookie race car from Cars who learns teamwork in Radiator Springs and sports the number 95." },
  { name: "Lionel Messi", category: "Athlete", longDescription: "Argentine soccer superstar known for close dribbling, prolific goals, Barcelona success, and winning the 2022 World Cup." },
  { name: "Little Red Riding Hood", category: "Literary character", longDescription: "Fairy-tale girl in a red hood who carries a basket through the woods and encounters a deceptive wolf." },
  { name: "Louis Armstrong", category: "Singer/Musician", longDescription: "Influential jazz trumpeter and singer with a gravelly voice, broad smile, and beloved recording about a wonderful world." },
  { name: "Louis XIV, The Sun King", category: "Historical figure", longDescription: "Long-reigning French monarch who built Versailles, embraced extravagant court life, and used the sun as his royal symbol." },
  { name: "Luke Skywalker", category: "Movie character", description: "Star Wars", longDescription: "Farm boy turned Jedi hero from Star Wars who learns the Force, wields a lightsaber, and confronts Darth Vader." },
  { name: "Mad Max", category: "Movie character", longDescription: "Road warrior who crosses a post-apocalyptic wasteland filled with roaring vehicles, scarce fuel, and desert warlords." },
  { name: "Madonna", category: "Singer/Actress", longDescription: "Pop icon known for constant reinvention, provocative performances, religious imagery, and dance hits spanning several decades." },
  { name: "Malcolm X", category: "Historical figure", longDescription: "Influential Black civil rights leader and gifted speaker who advocated self-determination before evolving toward broader human rights." },
  { name: "Marco Polo", category: "Historical figure", longDescription: "Venetian traveler whose medieval account described a long journey across Asia and the court of Kublai Khan." },
  { name: "Margaret Thatcher", category: "Historical figure", longDescription: "Britain's first female prime minister, nicknamed the Iron Lady for her uncompromising conservative leadership." },
  { name: "Marge Simpson", category: "Cartoon character", longDescription: "Patient blue-haired mother from The Simpsons who holds the chaotic family together with practical good sense." },
  { name: "Mark Zuckerberg", category: "Businessperson", longDescription: "Technology entrepreneur who cofounded Facebook in college and later renamed its parent company Meta." },
  { name: "Martin Luther King Jr.", category: "Historical figure", longDescription: "American civil rights leader and Baptist minister who championed nonviolent protest and delivered a famous dream-themed speech." },
  { name: "Mary Poppins", category: "Movie character", longDescription: "Magical British nanny who arrives by umbrella, carries an impossible carpetbag, and brings music and wonder to a family." },
  { name: "Merlin", category: "Literary character", longDescription: "Legendary wizard and adviser to King Arthur, associated with prophecy, magic, and the rise of Camelot." },
  { name: "Meryl Streep", category: "Movie/TV Actress", longDescription: "Highly acclaimed actress known for remarkable accents, versatility, and roles in Sophie's Choice and The Devil Wears Prada." },
  { name: "Michael Jackson", category: "Singer/Musician", longDescription: "Pop superstar known for the moonwalk, a single sparkling glove, elaborate music videos, and the album Thriller." },
  { name: "Michael Jordan", category: "Athlete", longDescription: "Chicago Bulls basketball legend known for six championships, the number 23, soaring dunks, and Air Jordan shoes." },
  { name: "Michael Myers", category: "Movie character", description: "Halloween", longDescription: "Silent masked pursuer from the Halloween films, recognizable by dark coveralls and an expressionless white face." },
  { name: "Michelle Obama", category: "Historical figure", longDescription: "Former U.S. first lady, lawyer, author, and advocate for healthy families, education, and civic participation." },
  { name: "Minion", category: "Movie character", description: "Despicable Me", longDescription: "Small yellow goggle-wearing helper from Despicable Me who speaks playful gibberish, loves bananas, and causes slapstick chaos." },
  { name: "Mona Lisa", category: "Historical figure", longDescription: "Mysteriously smiling woman in Leonardo da Vinci's world-famous portrait, displayed behind glass at the Louvre." },
  { name: "Mother Nature", category: "Literary character", longDescription: "Personification of the natural world, often imagined as a powerful woman controlling weather, seasons, plants, and animals." },
  { name: "Mozart", category: "Historical figure", longDescription: "Austrian classical composer and child prodigy who wrote operas, symphonies, and concertos with extraordinary speed and brilliance." },
  { name: "Mr. Clean", category: "Cartoon character", longDescription: "Bald, muscular household-cleaner mascot dressed in white, recognizable by a gold earring and folded arms." },
  { name: "Mr. Peanut", category: "Cartoon character", longDescription: "Dapper peanut mascot wearing a top hat, monocle, gloves, and carrying a gentleman's cane." },
  { name: "Mr. Potato Head", category: "Movie character", description: "Toy Story", longDescription: "Sarcastic Toy Story toy whose detachable eyes, ears, nose, and other facial pieces can be rearranged." },
  { name: "Mr. Rogers", category: "TV Personality", longDescription: "Gentle children's television host who changed into a cardigan and sneakers while teaching kindness and emotional understanding." },
  { name: "Muhammad Ali", category: "Athlete", longDescription: "Charismatic heavyweight boxing champion known for dazzling footwork, poetic boasts, social activism, and calling himself the greatest." },
  { name: "Naomi Campbell", category: "Model", longDescription: "British supermodel who became a defining runway star of the 1990s and broke major fashion-industry barriers." },
  { name: "Natalie Portman", category: "Movie/TV Actress", longDescription: "Oscar-winning actress known for Black Swan, playing Padmé in Star Wars, and beginning her career as a child." },
  { name: "Nelson Mandela", category: "Historical figure", longDescription: "South African anti-apartheid leader who spent 27 years imprisoned before becoming the country's first Black president." },
  { name: "Nemo", category: "Movie character", description: "Finding Nemo", longDescription: "Small orange-and-white clownfish from Finding Nemo who gets separated from his protective father and ends up in an aquarium." },
  { name: "Neo", category: "Movie character", description: "The Matrix", longDescription: "Computer hacker from The Matrix who discovers reality is simulated, dodges bullets, and may be the prophesied One." },
  { name: "Nikola Tesla", category: "Historical figure", longDescription: "Inventor and electrical pioneer associated with alternating current, high-voltage coils, and visionary experiments." },
  { name: "Oprah Winfrey", category: "TV Personality", longDescription: "Influential talk-show host and media mogul known for revealing interviews, book recommendations, and enthusiastic audience giveaways." },
  { name: "Pablo Escobar", category: "Historical figure", longDescription: "Colombian drug lord who led the Medellín Cartel and became notorious for immense wealth and power." },
  { name: "Pablo Picasso", category: "Historical figure", longDescription: "Spanish modern artist who helped pioneer Cubism, painting faces and bodies from multiple fragmented viewpoints." },
  { name: "Pac-Man", category: "Video game character", longDescription: "Round yellow arcade hero who races through mazes eating dots and fruit while avoiding colorful ghosts." },
  { name: "Paddington Bear", category: "Literary character", longDescription: "Polite bear from Peru who wears a blue coat and red hat, loves marmalade, and lives with the Browns." },
  { name: "Patrick Stewart", category: "Movie/TV Actor", longDescription: "British actor known for commanding roles as Captain Picard in Star Trek and Professor X in X-Men." },
  { name: "Peppa Pig", category: "Cartoon character", longDescription: "Cheerful pink cartoon pig who enjoys muddy puddles and everyday adventures with her family and friends." },
  { name: "Phoebe Buffay", category: "TV character", description: "Friends", longDescription: "Eccentric musician and masseuse from Friends, known for quirky beliefs, an unusual childhood, and songs about a smelly cat." },
  { name: "Pinocchio", category: "Literary character", longDescription: "Wooden puppet who dreams of becoming a real boy and whose nose grows whenever he tells a lie." },
  { name: "Pocahontas", category: "Historical figure", longDescription: "Powhatan woman remembered for her connection to the Jamestown settlement and later journey to England." },
  { name: "Popeye", category: "Cartoon character", longDescription: "Squinting sailor with oversized forearms who gains sudden strength from eating cans of spinach." },
  { name: "Prince Charles", category: "Royalty", longDescription: "Eldest son of Elizabeth II who spent decades as Prince of Wales before becoming King Charles III." },
  { name: "Prince Charming", category: "Literary character", longDescription: "Idealized fairy-tale suitor who rescues or searches for a princess, often arriving on horseback in royal attire." },
  { name: "Prince William", category: "Royalty", longDescription: "British royal, eldest son of King Charles III and Diana, and current heir to the throne." },
  { name: "Princess Leia", category: "Movie character", description: "Star Wars", longDescription: "Fearless Star Wars rebel leader known for side-bun hair, sharp wit, a blaster, and royal origins on Alderaan." },
  { name: "Quasimodo", category: "Literary character", description: "The Hunchback of Notre-Dame", longDescription: "Kindhearted bell-ringer from The Hunchback of Notre-Dame who lives in the Paris cathedral and longs for acceptance." },
  { name: "Quentin Tarantino", category: "Director", longDescription: "Director known for nonlinear crime films, stylized dialogue, pop-culture references, and movies such as Pulp Fiction." },
  { name: "Rachel Green", category: "TV character", description: "Friends", longDescription: "Fashion-loving Friends character who begins as a runaway bride, works at Central Perk, and builds a career in fashion." },
  { name: "Rafael Nadal", category: "Athlete", longDescription: "Spanish tennis champion nicknamed the King of Clay, famous for topspin, intensity, and record success at the French Open." },
  { name: "Rapunzel", category: "Literary character", longDescription: "Fairy-tale princess with extraordinarily long hair who is confined in a tower and awaits a path to freedom." },
  { name: "Rick Sanchez", category: "Cartoon character", description: "Rick and Morty", longDescription: "Brilliant, cynical scientist from Rick and Morty who travels between dimensions with his anxious grandson using a portal gun." },
  { name: "Rihanna", category: "Singer/Musician", longDescription: "Barbadian pop star and entrepreneur known for chart-topping dance hits, bold fashion, and the Fenty beauty brand." },
  { name: "Robin Hood", category: "Literary character", longDescription: "Legendary outlaw archer who lives in Sherwood Forest and steals from the rich to aid the poor." },
  { name: "Robinson Crusoe", category: "Literary character", longDescription: "Shipwrecked literary adventurer who survives for years on a remote island and befriends a man called Friday." },
  { name: "Rocky Balboa", category: "Movie character", longDescription: "Underdog Philadelphia boxer who trains on museum steps, fights with determination, and gets an unlikely championship opportunity." },
  { name: "Romeo Montague", category: "Literary character", description: "Romeo and Juliet", longDescription: "Young hero of Romeo and Juliet who falls for a woman from his family's rival household." },
  { name: "Ron Burgundy", category: "Movie character", description: "Anchorman", longDescription: "Overconfident 1970s San Diego news anchor from Anchorman, known for a mustache, suits, and hilariously self-important delivery." },
  { name: "Ronald McDonald", category: "Cartoon character", longDescription: "Red-haired clown mascot for McDonald's, typically dressed in yellow and red and associated with family-friendly advertising." },
  { name: "Rosa Parks", category: "Historical figure", longDescription: "Civil rights activist whose refusal to surrender her bus seat helped spark the Montgomery bus boycott." },
  { name: "Rose DeWitt Bukater", category: "Movie character", description: "Titanic", longDescription: "Young upper-class woman from Titanic who rejects a restrictive engagement and falls for artist Jack Dawson." },
  { name: "Ryan Seacrest", category: "TV Personality", longDescription: "American television and radio host best known for presenting American Idol and major red-carpet events." },
  { name: "Sabrina Spellman", category: "TV character", description: "Sabrina the Teenage Witch", longDescription: "Teenage witch who balances school, family magic, and a talking black cat named Salem." },
  { name: "Salvador Dali", category: "Historical figure", longDescription: "Spanish Surrealist artist known for a curled mustache, eccentric behavior, and dreamlike paintings of melting clocks." },
  { name: "Santa Claus", category: "Literary character", longDescription: "Jolly bearded Christmas figure in a red suit who travels by reindeer sleigh and delivers gifts to children." },
  { name: "Sauron", category: "Literary character", description: "The Lord of the Rings", longDescription: "Dark Lord of The Lord of the Rings who seeks dominion over Middle-earth through an all-powerful golden ring." },
  { name: "Scarlett Johansson", category: "Movie/TV Actress", longDescription: "American actress known for playing Marvel's Black Widow and roles in Lost in Translation and Marriage Story." },
  { name: "Scooby-Doo", category: "Cartoon character", longDescription: "Talking Great Dane who solves spooky mysteries with teenage friends, despite being easily frightened and constantly hungry." },
  { name: "Sean Connery", category: "Movie/TV Actor", longDescription: "Scottish actor best known as the first movie James Bond, bringing the spy a suave and commanding style." },
  { name: "Serena Williams", category: "Athlete", longDescription: "American tennis legend known for powerful serves, 23 major singles titles, and dominance alongside sister Venus." },
  { name: "Shaun the Sheep", category: "Cartoon character", longDescription: "Clever stop-motion sheep who silently leads his flock into comic adventures while outsmarting the farmer's dog." },
  { name: "Simba", category: "Movie character", description: "The Lion King", longDescription: "Lion prince from The Lion King who flees his homeland, befriends Timon and Pumbaa, and eventually faces his destiny." },
  { name: "Siri", category: "Brand/Mascot", description: "Apple", longDescription: "Apple's voice assistant on iPhones and other devices, used for questions, reminders, directions, and hands-free commands." },
  { name: "Sitting Bull", category: "Historical figure", longDescription: "Hunkpapa Lakota leader and spiritual figure who resisted U.S. expansion and was linked to victory at Little Bighorn." },
  { name: "Skeletor", category: "Cartoon character", longDescription: "Skull-faced cartoon villain who schemes to conquer Eternia and steal the secrets of Castle Grayskull from He-Man." },
  { name: "Sleeping Beauty", category: "Movie character", longDescription: "Fairy-tale princess cursed into enchanted sleep until awakened, surrounded by magic, a spindle, and protective fairies." },
  { name: "Sneezy", category: "Movie character", description: "Snow White and the Seven Dwarfs", longDescription: "One of Snow White's seven dwarfs, distinguished by powerful sneezes that interrupt work and send objects flying." },
  { name: "Snoop Dogg", category: "Singer/Musician", longDescription: "Laid-back West Coast rapper known for a smooth drawl, braided hairstyles, and numerous television and brand appearances." },
  { name: "Snow White", category: "Movie character", longDescription: "Fairy-tale princess with skin like snow who lives with seven dwarfs and receives a poisoned apple." },
  { name: "Spider-Man", category: "Comic character", longDescription: "Marvel superhero Peter Parker, who swings between buildings, sticks to walls, senses danger, and balances heroics with ordinary life." },
  { name: "Spock", category: "TV character", description: "Star Trek", longDescription: "Pointy-eared half-Vulcan science officer from Star Trek who values logic, suppresses emotion, and serves beside Captain Kirk." },
  { name: "Stan Lee", category: "Author", longDescription: "Marvel writer and editor who helped create Spider-Man, the X-Men, and many superheroes, later appearing in movie cameos." },
  { name: "Stephen Hawking", category: "Historical figure", longDescription: "British physicist who studied black holes and cosmology, wrote A Brief History of Time, and communicated using synthesized speech." },
  { name: "Stephen King", category: "Author", longDescription: "Prolific American horror author behind Carrie, The Shining, It, and many stories set in Maine." },
  { name: "Steve Irwin", category: "TV Personality", description: "The Crocodile Hunter", longDescription: "Enthusiastic Australian wildlife presenter called the Crocodile Hunter, known for khakis and close encounters with reptiles." },
  { name: "Steven Spielberg", category: "Director", longDescription: "Blockbuster director behind Jaws, E.T., Jurassic Park, and Indiana Jones, famous for wonder-filled cinematic storytelling." },
  { name: "Stevie Wonder", category: "Singer/Musician", longDescription: "Blind singer, songwriter, and multi-instrumentalist known for harmonica, soulful vocals, and landmark Motown albums." },
  { name: "Superman", category: "Comic character", longDescription: "DC hero from Krypton who hides as reporter Clark Kent and possesses flight, super-strength, and heat vision." },
  { name: "Sylvester the Cat", category: "Cartoon character", longDescription: "Black-and-white Looney Tunes cat with a lisp who repeatedly tries and fails to catch Tweety Bird." },
  { name: "Tarzan", category: "Literary character", longDescription: "Literary hero raised by apes in the African jungle, known for vine-swinging, great strength, and companion Jane." },
  { name: "Terminator", category: "Movie character", longDescription: "Relentless cyborg assassin sent through time, usually portrayed in dark sunglasses and associated with protecting or targeting future leaders." },
  { name: "The Devil", category: "Literary character", longDescription: "Personification of evil and temptation in many religious and folklore traditions, often depicted with horns, red skin, and a pitchfork." },
  { name: "The Genie", category: "Movie character", description: "Aladdin", longDescription: "Blue magical being from Aladdin who emerges from a lamp, grants three wishes, and performs shape-shifting comic spectacles." },
  { name: "The Invisible Man", category: "Literary character", longDescription: "Science-fiction character whose experiment makes his body unseen, leaving clothing, bandages, and floating objects as clues to his presence." },
  { name: "The Joker", category: "Comic character", longDescription: "Batman's chaotic comic-book enemy, recognizable by clown makeup, green hair, a purple suit, and dangerous practical jokes." },
  { name: "The Jolly Green Giant", category: "Cartoon character", longDescription: "Towering green mascot who watches over a valley of vegetables and promotes canned and frozen produce." },
  { name: "The Michelin Man", category: "Cartoon character", longDescription: "White tire-company mascot built from stacked rubber tires, one of advertising's oldest recognizable characters." },
  { name: "The Professor", category: "TV character", description: "Money Heist", longDescription: "Brilliant mastermind from Money Heist who plans elaborate robberies, recruits code-named thieves, and directs operations from hiding." },
  { name: "The Shark", category: "Movie character", description: "Jaws", longDescription: "Enormous great white from Jaws whose attacks threaten a beach town and are signaled by an ominous two-note theme." },
  { name: "Thomas Edison", category: "Historical figure", longDescription: "American inventor and businessman associated with the practical light bulb, phonograph, motion pictures, and a prolific patent laboratory." },
  { name: "Thomas the Tank Engine", category: "TV character", longDescription: "Cheerful blue number-one locomotive who works on the Island of Sodor and learns lessons with other talking trains." },
  { name: "Thor", category: "Comic character", longDescription: "Marvel's hammer-wielding god of thunder from Asgard, known for lightning powers, long hair, and membership in the Avengers." },
  { name: "Tiger Woods", category: "Athlete", longDescription: "American golf superstar known for red shirts on Sundays, numerous major championships, and transforming the sport's popularity." },
  { name: "Tokyo", category: "TV character", description: "Money Heist", longDescription: "Impulsive narrator and robber from Money Heist who joins the Professor's crew under a city-based code name." },
  { name: "Tom Brady", category: "Athlete", longDescription: "Record-setting American football quarterback who won multiple Super Bowls with New England and Tampa Bay." },
  { name: "Tom Cruise", category: "Movie/TV Actor", longDescription: "Hollywood action star known for Mission: Impossible, performing dangerous stunts, and a memorable fighter-pilot role in Top Gun." },
  { name: "Tony Montana", category: "Movie character", description: "Scarface", longDescription: "Ambitious Cuban immigrant turned Miami crime boss in Scarface, known for lavish excess and explosive confidence." },
  { name: "Tony Soprano", category: "TV character", description: "The Sopranos", longDescription: "New Jersey mob boss from The Sopranos who attends therapy while balancing criminal leadership and suburban family pressures." },
  { name: "Tony the Tiger", category: "Cartoon character", longDescription: "Muscular orange cereal mascot with a red neckerchief who enthusiastically promotes Frosted Flakes." },
  { name: "Toto", category: "Literary character", description: "The Wizard of Oz", longDescription: "Dorothy's small black dog in The Wizard of Oz, who accompanies her from Kansas along the yellow brick road." },
  { name: "Tutankhamen", category: "Historical figure", longDescription: "Young Egyptian pharaoh whose nearly intact golden tomb was discovered in 1922, inspiring worldwide fascination with ancient Egypt." },
  { name: "Ulysses", category: "Literary character", longDescription: "Roman name for Odysseus, the clever wandering hero who spends ten years returning home after the Trojan War." },
  { name: "Uncle Sam", category: "Literary character", longDescription: "Bearded personification of the United States, usually wearing stars and stripes and pointing from a famous recruitment poster." },
  { name: "Usain Bolt", category: "Athlete", longDescription: "Jamaican sprinting legend and world-record holder known for lightning speed and his celebratory lightning-bolt pose." },
  { name: "Victoria Beckham", category: "Singer/Musician", longDescription: "British singer known as Posh Spice from the Spice Girls who later became a prominent fashion designer." },
  { name: "Vincent van Gogh", category: "Historical figure", longDescription: "Dutch Post-Impressionist painter known for swirling stars, vivid sunflowers, expressive brushwork, and the story of his injured ear." },
  { name: "Voldemort", category: "Literary character", description: "Harry Potter", longDescription: "Noseless dark wizard from Harry Potter who fears death, commands loyal followers, and is linked to Harry by a lightning scar." },
  { name: "Wall-E", category: "Movie character", longDescription: "Lonely trash-compacting robot left to clean an abandoned Earth who collects treasures and falls for a sleek probe named EVE." },
  { name: "Whoopi Goldberg", category: "Movie/TV Actress", longDescription: "American actress, comedian, and television host known for Sister Act, Ghost, and cohosting The View." },
  { name: "Willie Mays", category: "Athlete", longDescription: "Baseball legend nicknamed the Say Hey Kid, celebrated for power, speed, and an iconic over-the-shoulder World Series catch." },
  { name: "Winnie-the-Pooh", category: "Literary character", longDescription: "Gentle bear from the Hundred Acre Wood who loves honey and shares simple adventures with Piglet, Tigger, and Christopher Robin." },
  { name: "Winston Churchill", category: "Historical figure", longDescription: "British prime minister who rallied the United Kingdom during World War II, known for cigars, speeches, and a bulldog-like image." },
  { name: "Wolverine", category: "Comic character", longDescription: "Gruff X-Men hero with retractable metal claws, rapid healing, heightened senses, and a mysterious past." },
  { name: "Woodstock", category: "Cartoon character", description: "Peanuts", longDescription: "Tiny yellow bird from Peanuts who communicates in scribbles and serves as Snoopy's loyal, quirky companion." },
  { name: "Woody Allen", category: "Director", longDescription: "American filmmaker known for neurotic comedy, New York settings, and movies such as Annie Hall and Manhattan." },
  { name: "Wyatt Earp", category: "Historical figure", longDescription: "Old West lawman associated with Tombstone, Arizona, and the famous gunfight near the O.K. Corral." },
  { name: "Yoda", category: "Movie character", description: "Star Wars", longDescription: "Small green Jedi master from Star Wars, known for great wisdom, unusual word order, and powerful command of the Force." },
  { name: "Zelda", category: "Video game character", description: "The Legend of Zelda", longDescription: "Princess of Hyrule from The Legend of Zelda, often connected to wisdom, sacred power, and hero Link's quests." },
  { name: "Zeus", category: "Literary character", longDescription: "King of the Greek gods who rules from Mount Olympus and wields thunderbolts as his signature weapon." },
];

/** Max characters that may share the same category in one deal. */
const MAX_PER_CATEGORY = 2;

/** Once the list is large enough, avoid reusing characters across rounds. */
const UNIQUE_ACROSS_ROUNDS_THRESHOLD = 32;

/**
 * Persist how often each character has been dealt on this browser/device.
 * Deals prefer less-played names so the roster rotates over time.
 */
const CharacterHistory = (() => {
  const STORAGE_KEY = "secret-identity.character-plays";

  function loadPlays() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const data = JSON.parse(raw);
      if (data && data.plays && typeof data.plays === "object") return data.plays;
      if (data && typeof data === "object" && !Array.isArray(data)) return data;
    } catch (_) {
      /* ignore corrupt storage */
    }
    return {};
  }

  function savePlays(plays) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, plays })
      );
    } catch (_) {
      /* private mode / quota — dealing still works without persistence */
    }
  }

  function getCount(name) {
    const plays = loadPlays();
    return Number(plays[name]) || 0;
  }

  /** Set an absolute play count for a character (device-local). */
  function setCount(name, count) {
    if (!name) return;
    const plays = loadPlays();
    const value = Math.max(0, Math.floor(Number(count) || 0));
    if (value === 0) delete plays[name];
    else plays[name] = value;
    savePlays(plays);
  }

  /** Increment play counts for the given character names. */
  function record(names) {
    if (!names || !names.length) return;
    const plays = loadPlays();
    names.forEach((name) => {
      if (!name) return;
      plays[name] = (Number(plays[name]) || 0) + 1;
    });
    savePlays(plays);
  }

  /**
   * Shuffle within each play-count bucket, then concatenate from least → most played.
   * So never-seen characters are tried before ones already dealt on this device.
   */
  function orderByLeastPlayed(characters) {
    const plays = loadPlays();
    const groups = new Map();

    characters.forEach((character) => {
      const count = Number(plays[character.name]) || 0;
      if (!groups.has(count)) groups.set(count, []);
      groups.get(count).push(character);
    });

    const ordered = [];
    [...groups.keys()]
      .sort((a, b) => a - b)
      .forEach((count) => {
        ordered.push(...shuffle(groups.get(count)));
      });
    return ordered;
  }

  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  return { getCount, setCount, record, orderByLeastPlayed, clear, loadPlays };
})();

/**
 * Device-local catalog overlays on top of the seeded CHARACTERS array.
 * Play counts stay in CharacterHistory; definition edits live here until
 * exported into characters.js and committed on desktop.
 */
const CharacterCatalog = (() => {
  const STORAGE_KEY = "secret-identity.character-catalog";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { extras: [], overrides: {} };
      const data = JSON.parse(raw);
      return {
        extras: Array.isArray(data.extras) ? data.extras : [],
        overrides:
          data.overrides && typeof data.overrides === "object" ? data.overrides : {},
      };
    } catch (_) {
      return { extras: [], overrides: {} };
    }
  }

  function save(state) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, extras: state.extras, overrides: state.overrides })
      );
    } catch (_) {
      /* ignore */
    }
  }

  /**
   * Accept a string, slash/comma-separated string, or array → unique trimmed labels.
   * "Singer/Actor" and "Singer, Actor" both become ["Singer", "Actor"].
   */
  function normalizeCategories(value) {
    const parts = [];
    const pushParts = (raw) => {
      String(raw)
        .split(/[/|,]/)
        .forEach((part) => {
          const trimmed = part.trim();
          if (trimmed) parts.push(trimmed);
        });
    };

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item == null) return;
        pushParts(item);
      });
    } else if (value != null && String(value).trim()) {
      pushParts(value);
    }

    const seen = new Set();
    const out = [];
    parts.forEach((part) => {
      const key = part.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      out.push(part);
    });
    return out.length ? out : ["Celebrity"];
  }

  function formatCategories(categories) {
    const list = Array.isArray(categories) ? categories : normalizeCategories(categories);
    return list.join("/");
  }

  function categoriesEqual(a, b) {
    const left = normalizeCategories(a);
    const right = normalizeCategories(b);
    if (left.length !== right.length) return false;
    return left.every((value, index) => value === right[index]);
  }

  function categoriesOf(entry) {
    if (!entry) return [];
    if (Array.isArray(entry.categories) && entry.categories.length) {
      return normalizeCategories(entry.categories);
    }
    return normalizeCategories(entry.category);
  }

  function normalizeEntry(entry) {
    const name = String(entry.name || "").trim();
    if (!name) return null;
    const categories = normalizeCategories(entry.categories ?? entry.category);
    const out = {
      name,
      categories,
      category: formatCategories(categories),
    };
    const description =
      entry.description == null ? "" : String(entry.description).trim();
    if (description) out.description = description;
    const longDescription =
      entry.longDescription == null ? "" : String(entry.longDescription).trim();
    if (longDescription) out.longDescription = longDescription;
    if (entry.disabled) out.disabled = true;
    return out;
  }

  /** Full merged roster (seed + local extras/overrides), including disabled. */
  function list() {
    const { extras, overrides } = load();
    const rows = [];

    CHARACTERS.forEach((seed) => {
      const override = overrides[seed.name];
      if (override && override.deleted) return;
      const categories =
        override &&
        (Object.prototype.hasOwnProperty.call(override, "categories") ||
          Object.prototype.hasOwnProperty.call(override, "category"))
          ? normalizeCategories(override.categories ?? override.category)
          : normalizeCategories(seed.categories ?? seed.category);
      const merged = {
        name: override?.name != null ? String(override.name).trim() : seed.name,
        categories,
        category: formatCategories(categories),
        description:
          override && Object.prototype.hasOwnProperty.call(override, "description")
            ? override.description
            : seed.description,
        longDescription:
          override && Object.prototype.hasOwnProperty.call(override, "longDescription")
            ? override.longDescription
            : seed.longDescription,
        disabled:
          override && Object.prototype.hasOwnProperty.call(override, "disabled")
            ? Boolean(override.disabled)
            : Boolean(seed.disabled),
        source: "seed",
        seedName: seed.name,
      };
      if (!merged.description) delete merged.description;
      if (!merged.longDescription) delete merged.longDescription;
      rows.push(merged);
    });

    extras.forEach((extra, index) => {
      const entry = normalizeEntry(extra);
      if (!entry) return;
      rows.push({
        ...entry,
        disabled: Boolean(extra.disabled),
        source: "local",
        seedName: null,
        localIndex: index,
      });
    });

    return rows;
  }

  function listEnabled() {
    return list().filter((entry) => !entry.disabled);
  }

  function categories() {
    const set = new Set();
    list().forEach((entry) => {
      categoriesOf(entry).forEach((category) => set.add(category));
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  function upsertOverride(seedName, fields) {
    const state = load();
    const prev = state.overrides[seedName] || {};
    const next = { ...prev };

    if (fields.name != null) next.name = String(fields.name).trim();
    if (
      Object.prototype.hasOwnProperty.call(fields, "categories") ||
      Object.prototype.hasOwnProperty.call(fields, "category")
    ) {
      next.categories = normalizeCategories(fields.categories ?? fields.category);
      delete next.category;
    }
    if (Object.prototype.hasOwnProperty.call(fields, "description")) {
      const description = fields.description == null ? "" : String(fields.description).trim();
      next.description = description || null;
    }
    if (Object.prototype.hasOwnProperty.call(fields, "longDescription")) {
      const longDescription =
        fields.longDescription == null ? "" : String(fields.longDescription).trim();
      next.longDescription = longDescription || null;
    }
    if (Object.prototype.hasOwnProperty.call(fields, "disabled")) {
      next.disabled = Boolean(fields.disabled);
    }

    // Drop override keys that match the seed exactly.
    const seed = CHARACTERS.find((entry) => entry.name === seedName);
    if (seed) {
      if (next.name === seed.name) delete next.name;
      if (
        next.categories &&
        categoriesEqual(next.categories, seed.categories ?? seed.category)
      ) {
        delete next.categories;
        delete next.category;
      }
      if ((next.description || null) === (seed.description || null)) {
        delete next.description;
      }
      if ((next.longDescription || null) === (seed.longDescription || null)) {
        delete next.longDescription;
      }
      if (Boolean(next.disabled) === Boolean(seed.disabled)) delete next.disabled;
    }

    if (Object.keys(next).length === 0) delete state.overrides[seedName];
    else state.overrides[seedName] = next;
    save(state);
  }

  function add(fields) {
    const entry = normalizeEntry(fields);
    if (!entry) return { ok: false, error: "Name is required." };
    const existing = list().some(
      (row) => row.name.toLowerCase() === entry.name.toLowerCase()
    );
    if (existing) return { ok: false, error: "A character with that name already exists." };

    const state = load();
    state.extras.push({
      name: entry.name,
      categories: entry.categories,
      description: entry.description,
      longDescription: entry.longDescription,
      disabled: Boolean(fields.disabled),
    });
    save(state);
    if (typeof fields.plays === "number") {
      CharacterHistory.setCount(entry.name, fields.plays);
    }
    return { ok: true, character: entry };
  }

  function update(rowKey, fields) {
    // rowKey: { source, seedName, localIndex, name }
    if (rowKey.source === "seed" && rowKey.seedName) {
      const previousName = list().find((row) => row.seedName === rowKey.seedName)?.name;
      upsertOverride(rowKey.seedName, fields);
      if (previousName && fields.name && fields.name.trim() !== previousName) {
        const plays = CharacterHistory.getCount(previousName);
        CharacterHistory.setCount(fields.name.trim(), plays);
        CharacterHistory.setCount(previousName, 0);
      }
      if (typeof fields.plays === "number") {
        const nextName =
          fields.name != null ? String(fields.name).trim() : previousName;
        CharacterHistory.setCount(nextName, fields.plays);
      }
      return { ok: true };
    }

    if (rowKey.source === "local" && Number.isInteger(rowKey.localIndex)) {
      const state = load();
      const current = state.extras[rowKey.localIndex];
      if (!current) return { ok: false, error: "Character not found." };
      const previousName = current.name;
      const entry = normalizeEntry({ ...current, ...fields });
      if (!entry) return { ok: false, error: "Name is required." };
      state.extras[rowKey.localIndex] = {
        name: entry.name,
        categories: entry.categories,
        description: entry.description,
        longDescription: entry.longDescription,
        disabled: Boolean(
          Object.prototype.hasOwnProperty.call(fields, "disabled")
            ? fields.disabled
            : current.disabled
        ),
      };
      save(state);
      if (fields.name && entry.name !== previousName) {
        const plays = CharacterHistory.getCount(previousName);
        CharacterHistory.setCount(entry.name, plays);
        CharacterHistory.setCount(previousName, 0);
      }
      if (typeof fields.plays === "number") {
        CharacterHistory.setCount(entry.name, fields.plays);
      }
      return { ok: true };
    }

    return { ok: false, error: "Unknown character." };
  }

  function removeLocal(localIndex) {
    const state = load();
    if (!Number.isInteger(localIndex) || !state.extras[localIndex]) {
      return { ok: false, error: "Character not found." };
    }
    const [removed] = state.extras.splice(localIndex, 1);
    save(state);
    if (removed?.name) CharacterHistory.setCount(removed.name, 0);
    return { ok: true };
  }

  function clearLocalEdits() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  function rowKeyFor(row) {
    if (row.source === "seed") {
      return { source: "seed", seedName: row.seedName };
    }
    return { source: "local", localIndex: row.localIndex };
  }

  function renameCategory(fromName, toName) {
    const from = String(fromName || "").trim();
    const to = String(toName || "").trim();
    if (!from || !to) return { ok: false, error: "Both names are required." };
    let updated = 0;
    list().forEach((row) => {
      const cats = categoriesOf(row);
      if (!cats.some((item) => item.toLowerCase() === from.toLowerCase())) return;
      const next = normalizeCategories(
        cats.map((item) => (item.toLowerCase() === from.toLowerCase() ? to : item))
      );
      const result = update(rowKeyFor(row), { categories: next });
      if (result.ok) updated += 1;
    });
    return { ok: true, updated };
  }

  function removeCategory(categoryName) {
    const label = String(categoryName || "").trim();
    if (!label) return { ok: false, error: "Category required." };
    let updated = 0;
    list().forEach((row) => {
      const cats = categoriesOf(row);
      if (!cats.some((item) => item.toLowerCase() === label.toLowerCase())) return;
      const next = cats.filter((item) => item.toLowerCase() !== label.toLowerCase());
      const result = update(rowKeyFor(row), {
        categories: next.length ? next : ["Celebrity"],
      });
      if (result.ok) updated += 1;
    });
    return { ok: true, updated };
  }

  function toExportObjects() {
    return list().map((row) => {
      const cats = categoriesOf(row);
      const entry = { name: row.name };
      if (cats.length <= 1) {
        entry.category = cats[0] || "Celebrity";
      } else {
        entry.categories = cats;
      }
      if (row.description) entry.description = row.description;
      if (row.longDescription) entry.longDescription = row.longDescription;
      if (row.disabled) entry.disabled = true;
      return entry;
    });
  }

  function formatCharactersArrayJs() {
    const rows = toExportObjects();
    const lines = rows.map((entry) => {
      const parts = [`name: ${JSON.stringify(entry.name)}`];
      if (entry.categories) {
        parts.push(`categories: ${JSON.stringify(entry.categories)}`);
      } else {
        parts.push(`category: ${JSON.stringify(entry.category)}`);
      }
      if (entry.description) {
        parts.push(`description: ${JSON.stringify(entry.description)}`);
      }
      if (entry.longDescription) {
        parts.push(`longDescription: ${JSON.stringify(entry.longDescription)}`);
      }
      if (entry.disabled) parts.push("disabled: true");
      return `  { ${parts.join(", ")} },`;
    });
    return `const CHARACTERS = [\n${lines.join("\n")}\n];\n`;
  }

  return {
    list,
    listEnabled,
    categories,
    categoriesOf,
    normalizeCategories,
    formatCategories,
    renameCategory,
    removeCategory,
    add,
    update,
    removeLocal,
    clearLocalEdits,
    toExportObjects,
    formatCharactersArrayJs,
    load,
  };
})();

/**
 * Managed list of standard category labels used by the edit UI.
 * Seeded from (and kept in sync with) categories actually used on characters.
 */
const CategoryCatalog = (() => {
  const STORAGE_KEY = "secret-identity.categories";

  function loadStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!Array.isArray(data?.categories)) return null;
      return CharacterCatalog.normalizeCategories(data.categories);
    } catch (_) {
      return null;
    }
  }

  function save(categories) {
    const unique = CharacterCatalog.normalizeCategories(categories);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, categories: unique })
      );
    } catch (_) {
      /* ignore */
    }
    return unique;
  }

  function usedOnRoster() {
    return CharacterCatalog.categories();
  }

  function list() {
    const stored = loadStored();
    const used = usedOnRoster();
    const set = new Set();
    (stored || []).forEach((name) => set.add(name));
    used.forEach((name) => set.add(name));
    if (!stored) {
      // First run: persist roster-derived standards so Manage has a real list.
      const seeded = [...set].sort((a, b) => a.localeCompare(b));
      save(seeded);
      return seeded;
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  function standardsOnly() {
    const stored = loadStored();
    if (!stored) return list();
    return [...stored].sort((a, b) => a.localeCompare(b));
  }

  function add(name) {
    const next = CharacterCatalog.normalizeCategories(name);
    if (!next.length) return { ok: false, error: "Enter a category name." };
    const label = next[0];
    const current = list();
    if (current.some((item) => item.toLowerCase() === label.toLowerCase())) {
      return { ok: false, error: "That category already exists." };
    }
    const stored = loadStored() || current;
    save([...stored, label]);
    return { ok: true, category: label };
  }

  function rename(fromName, toName) {
    const from = String(fromName || "").trim();
    const to = CharacterCatalog.normalizeCategories(toName)[0];
    if (!from || !to) return { ok: false, error: "Both names are required." };
    if (from.toLowerCase() === to.toLowerCase()) {
      return { ok: false, error: "New name must be different." };
    }
    const current = list();
    if (current.some((item) => item.toLowerCase() === to.toLowerCase() && item.toLowerCase() !== from.toLowerCase())) {
      return { ok: false, error: "That category already exists." };
    }
    const rosterResult = CharacterCatalog.renameCategory(from, to);
    if (!rosterResult.ok) return rosterResult;
    const stored = (loadStored() || current).map((item) =>
      item.toLowerCase() === from.toLowerCase() ? to : item
    );
    save(stored);
    return { ok: true, category: to, updated: rosterResult.updated };
  }

  function remove(name) {
    const label = String(name || "").trim();
    if (!label) return { ok: false, error: "Category required." };
    const rosterResult = CharacterCatalog.removeCategory(label);
    if (!rosterResult.ok) return rosterResult;
    const stored = (loadStored() || list()).filter(
      (item) => item.toLowerCase() !== label.toLowerCase()
    );
    save(stored);
    return { ok: true, updated: rosterResult.updated };
  }

  return { list, standardsOnly, add, rename, remove };
})();

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Pick `count` unique characters, allowing at most MAX_PER_CATEGORY
 * from any single category. Entries without categories are unrestricted.
 * Prefers characters dealt fewer times on this device (localStorage).
 *
 * @param {number} count
 * @param {{ excludeNames?: string[], categoryCounts?: Record<string, number> }} [options]
 */
function pickCharacters(count, options = {}) {
  const excludeNames = new Set(options.excludeNames || []);
  const enabled = CharacterCatalog.listEnabled();
  const enforceUnique =
    enabled.length >= UNIQUE_ACROSS_ROUNDS_THRESHOLD && excludeNames.size > 0;

  let source = enabled;
  if (excludeNames.size > 0) {
    source = source.filter((character) => !excludeNames.has(character.name));
  }

  const pool = CharacterHistory.orderByLeastPlayed(source);
  const picks = [];
  const categoryCounts = Object.create(null);
  if (options.categoryCounts) {
    Object.assign(categoryCounts, options.categoryCounts);
  }

  for (const character of pool) {
    if (picks.length >= count) break;

    const cats = CharacterCatalog.categoriesOf(character);
    if (cats.some((category) => (categoryCounts[category] || 0) >= MAX_PER_CATEGORY)) {
      continue;
    }
    cats.forEach((category) => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    picks.push(character);
  }

  if (picks.length < count) {
    console.warn(
      `Could only pick ${picks.length} of ${count} characters under the ` +
        `max-${MAX_PER_CATEGORY}-per-category rule. Add more variety to CHARACTERS.`
    );
  }

  return picks;
}

/**
 * Pick a single replacement character for a slot.
 * @param {{ excludeNames?: string[], categoryCounts?: Record<string, number> }} [options]
 */
function pickReplacementCharacter(options = {}) {
  const picks = pickCharacters(1, options);
  const next = picks[0] || null;
  if (next) CharacterHistory.record([next.name]);
  return next;
}

function toSlotCharacter(character, slotNumber) {
  const categories = CharacterCatalog.categoriesOf(character);
  return {
    number: slotNumber,
    name: character.name,
    categories,
    category: categories.length ? CharacterCatalog.formatCategories(categories) : null,
    description: character.description || null,
    longDescription: character.longDescription || null,
  };
}

function renderCharacter(container, character) {
  container.replaceChildren();

  function makeFace(modifier) {
    const face = document.createElement("span");
    face.className = `box__character-face box__character-face--${modifier}`;

    const nameEl = document.createElement("span");
    nameEl.className = "box__name";
    nameEl.textContent = character.name;
    face.appendChild(nameEl);

    if (character.description) {
      const descEl = document.createElement("span");
      descEl.className = "box__qualifier";
      descEl.textContent = character.description;
      face.appendChild(descEl);
    }

    return face;
  }

  const up = makeFace("up");
  const divider = document.createElement("span");
  divider.className = "box__character-divider";
  divider.setAttribute("aria-hidden", "true");
  const down = makeFace("down");

  // Flip mode: upside-down on top, upright on bottom (for opposite sides of the table).
  container.append(down, divider, up);
}

/**
 * Apply a dealt list of slot characters (length 8) to the left-column boxes.
 * @param {Array<{number:number, name:string, category?:string|null, description?:string|null}>} slotCharacters
 */
function applyCharactersToBoxes(slotCharacters) {
  const slots = document.querySelectorAll(".column--left .box--black");

  slots.forEach((box, index) => {
    const characterEl = box.querySelector(".box__character");
    const character = slotCharacters[index];
    const slotNumber = index + 1;

    if (!character) {
      characterEl.replaceChildren();
      box.removeAttribute("data-character");
      delete box._character;
      box.setAttribute("aria-label", `Character slot ${slotNumber}`);
      return;
    }

    const categories = CharacterCatalog.categoriesOf(character);
    const slotData = {
      number: slotNumber,
      name: character.name,
      categories,
      category: categories.length
        ? CharacterCatalog.formatCategories(categories)
        : null,
      description: character.description || null,
      longDescription: character.longDescription || null,
    };

    renderCharacter(characterEl, slotData);
    box._character = slotData;
    box.dataset.character = slotData.name;
    if (slotData.category) {
      box.dataset.category = slotData.category;
    } else {
      delete box.dataset.category;
    }
    box.setAttribute(
      "aria-label",
      `Character slot ${slotNumber}: ${slotData.name}`
    );
  });
}

function dealCharacters(count, excludeNames = []) {
  const picks = pickCharacters(count, { excludeNames });
  CharacterHistory.record(picks.map((character) => character.name));
  return picks.map((character, index) => toSlotCharacter(character, index + 1));
}

function bindCharacterBoxClicks() {
  document.querySelector(".column--left")?.addEventListener("click", (event) => {
    if (event.target.closest(".round-indicator")) return;
    const box = event.target.closest(".box--black");
    if (!box || !box._character) return;
    CharacterModule.open(box._character);
  });
}

bindCharacterBoxClicks();

/**
 * In-app characters fullscreen: 2×4 grid of black boxes, scores hidden.
 * Optional flip mode mirrors names upside-down for opposite sides of the table.
 */
const CharactersFullscreen = (() => {
  const controls = document.getElementById("characters-view-controls");
  const toggle = document.getElementById("characters-fullscreen-toggle");
  const flipToggle = document.getElementById("characters-flip-toggle");
  const expandIcon = toggle?.querySelector(".characters-fullscreen-toggle__icon--expand");
  const collapseIcon = toggle?.querySelector(".characters-fullscreen-toggle__icon--collapse");

  function isActive() {
    return document.body.classList.contains("characters-fullscreen");
  }

  function isFlipActive() {
    return document.body.classList.contains("characters-flip");
  }

  function syncToggleUi() {
    if (!toggle) return;
    const active = isActive();
    toggle.setAttribute("aria-pressed", active ? "true" : "false");
    toggle.setAttribute("aria-label", active ? "Collapse characters" : "Expand characters");
    if (expandIcon) expandIcon.hidden = active;
    if (collapseIcon) collapseIcon.hidden = !active;
    if (flipToggle) {
      flipToggle.hidden = !active;
      flipToggle.setAttribute("aria-pressed", isFlipActive() ? "true" : "false");
    }
  }

  function refreshRenderedCharacters() {
    document.querySelectorAll(".column--left .box--black").forEach((box) => {
      if (!box._character) return;
      const characterEl = box.querySelector(".box__character");
      if (characterEl) renderCharacter(characterEl, box._character);
    });
  }

  function setFlipActive(active) {
    document.body.classList.toggle("characters-flip", Boolean(active) && isActive());
    if (isActive()) refreshRenderedCharacters();
    syncToggleUi();
  }

  function setActive(active) {
    document.body.classList.toggle("characters-fullscreen", Boolean(active));
    if (!active) {
      document.body.classList.remove("characters-flip");
    } else {
      refreshRenderedCharacters();
    }
    syncToggleUi();
  }

  function toggleMode() {
    setActive(!isActive());
  }

  function toggleFlip() {
    if (!isActive()) return;
    setFlipActive(!isFlipActive());
  }

  function showToggle(visible) {
    if (!controls) return;
    controls.hidden = !visible;
    if (!visible) setActive(false);
  }

  toggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMode();
  });

  flipToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFlip();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isActive()) {
      // Don't steal Escape from open modals.
      if (document.body.classList.contains("character-module-open")) return;
      if (document.body.classList.contains("score-module-open")) return;
      if (document.body.classList.contains("new-game-module-open")) return;
      if (document.getElementById("character-replace-confirm") && !document.getElementById("character-replace-confirm").hidden) {
        return;
      }
      setActive(false);
    }
  });

  syncToggleUi();

  return { isActive, setActive, toggleMode, showToggle, isFlipActive, setFlipActive, toggleFlip };
})();
