class Author::Interview < Neo
	def initialize author_id
		@author_id = author_id
	end

	def self.match_question
		" MATCH (author)-[answered:Answered]->(question:Question) WITH author, question "
	end

	def match_answer
		" MATCH (question)<-[answer_of:AnswerOf{author_id:"+@author_id+"}]-(interview_answer:InterviewAnswer) WITH question, interview_answer AS interview_answer"
	end

	def self.optional_match_question
		" OPTIONAL " + Author::Interview.match_question
	end

	def self.grouped_basic_info
		" question: question.name, interview_answer: interview_answer.name "
	end

	def self.basic_info
		" question.name AS question, interview_answer.name AS interview_answer"
	end
end