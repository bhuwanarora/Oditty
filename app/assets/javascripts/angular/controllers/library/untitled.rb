MATCH (b:Book) 
WHERE ID(b)=395153 
MATCH p=(b)-[:Next_book*..20]->(b_next) 
WITH last(nodes(p)) AS book 
OPTIONAL MATCH (book)<-[:MarkAsRead]-(:MarkAsReadNode)<-[m:MarkAsReadAction]-(user:User) 
WHERE ID(user)=0 
WITH user, book, m 
OPTIONAL MATCH (user)-[:RatingAction]->(z:RatingNode{book_id:ID(book), user_id:0})-[:Rate]->(book) 
WITH user, book, m, z 
MATCH (book)-[]->(category:Category{is_root: true}) 
RETURN book.isbn AS isbn, ID(book) AS id, book.title AS title, book.author_name AS author_name, ID(m) AS status, z.rating AS user_rating, book.published_year AS published_year, book.page_count AS page_count, COLLECT(category.id
) AS categories_id, COLLECT(category.name) AS categories_name 
SKIP 0