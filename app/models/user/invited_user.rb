class User::InvitedUser < User
	InvitationRelation = 'InvitedToJoin'
	InvitationProperty = 'invited_by_someone'

	def self.user_invites_friend
		" MERGE (user)-[invite_rel:" + InvitationRelation + "]->(friend) "\
		" ON CREATE " + User::InvitedUser.increment_invite_count + ", invite_rel.created_at = " + Time.now.to_i.to_s + ""\
	end

	def self.match friend = 'friend'
		if friend == 'user'
			clause = " MATCH (user:User)-[invite_rel:" + InvitationRelation + "]->(friend:User) "
		else
			clause = " MATCH (friend:User)-[invite_rel:" + InvitationRelation + "]->(user:User) "
		end
		clause
	end

	def self.match_first_login friend = 'friend'
		if friend == 'user'
			clause = " MATCH (user:User)-[invite_rel:" + InvitationRelation + "]->(friend:User) "
		else
			clause = " MATCH (friend:User)-[invite_rel:" + InvitationRelation + "]->(user:User) "
		end
		clause += ""\
			" WITH user, friend, invite_rel "\
			" WHERE NOT HAS(invite_rel.decrement_user_waiting_list) "\
			" SET invite_rel.decrement_user_waiting_list = true "\
			" WITH user, friend "
		clause
	end

	def self.set_decrement_user_waiting_list
		" SET invite_rel.decrement_user_waiting_list = true "
	end

	def self.invited_info
		"user." + InvitationProperty + " AS " + InvitationProperty + " "
	end

	def self.count_invites
		" OPTIONAL " + User::InvitedUser.match("user") + " WITH user, COUNT(invite_rel) AS invite_count "
	end

	def self.remove_invited_status
		" REMOVE user." + InvitationProperty + " "\
		" REMOVE user:" + Constant::EntityLabel::HiddenUser + " "
	end

	def self.increment_invite_count
		" SET user.invite_count = COALESCE(user.invite_count,0) + 1 "
	end

	def self.invite inviter_id, email
		" MERGE(user:" + Constant::EntityLabel::User + "{email:\'" + email.strip + "\'}) "\
		" ON CREATE SET user." + InvitationProperty + "= true, user:" + Constant::EntityLabel::HiddenUser + " "\
		" WITH user AS friend "\
		" " + User.new(inviter_id).match + ", friend " + User::InvitedUser.user_invites_friend + " "\
		" RETURN user.first_name AS inviter_name"
	end

	def self.increment_followed_by_count
		" SET user.followed_by_count = COALESCE(user.followed_by_count,0) + followed_by_count "
	end

	def self.create_follows_link
		" MATCH (user)<-[:" + InvitationRelation + "]-(friend:User) "\
		" " + User::Info.set_follows_count + ""\
		" WITH DISTINCT user, friend "\
		"" + UsersUser.new(nil,nil).create + ""\
		" WITH DISTINCT user AS f, friend AS u "\
		" WITH f AS friend, u AS user "\
		" " + User::Info.set_followed_by_count + " "\
		"" + User::Info.set_follows_count + UsersUser.new(nil,nil).create + ""\
		" WITH DISTINCT friend, COUNT(user) AS followed_by_count "\
		" WITH friend AS user, followed_by_count "\
		" " + User::InvitedUser.increment_followed_by_count + " "\
		" WITH user "
	end

	def self.set_username_password_verification_token email, password, verification_token = ""
		" SET user.email = \'" + email + "\', user.verification_token=\"" + verification_token + "\", user.password=\"" + password + "\", user.like_count=0, user.rating_count=0, user.timer_count=0, user.dislike_count=0, user.comment_count=0, user.bookmark_count=0, user.book_read_count=0, user.follows_count=0, user.followed_by_count=0, user.last_book= "+Constant::Id::BestBook.to_s+", user.amateur= true, user.ask_info= true, user.verification_time =" + Time.now.to_i.to_s + " "
	end

	def handle_new(email, password = "", verification_token = "")
		default_user_name = email.split("@")[0]
		match + User::InvitedUser.set_username_password_verification_token(email, password, verification_token) + User::InvitedUser.create_links_for_new + User.set_name(default_user_name) + User::InvitedUser.remove_invited_status + " WITH DISTINCT user " + User::InvitedUser.create_follows_link +  User.return_init + User.basic_info
	end

	def handle_new_from_facebook params
		match + User::Info.set_last_login + " WITH user " + User::InvitedUser.create_follows_link + User::FacebookUser.new(params).add_info + User.create_links_for_new + User::FacebookUser.create_facebook_user + ( params["thumb"].present? ? User::Info.set_thumb(params["thumb"]) : " " ) + User::FacebookUser.set_name(params["name"]) + User::InvitedUser.remove_invited_status + User::Authenticate::FacebookAuthentication.new(params).fb_set_clause
	end

	def self.check_before_invite inviter_id, invitee_email
		User.new(inviter_id).match + " WITH user AS inviter "\
		"OPTIONAL " + User.match_by_email(invitee_email) + ", inviter "\
		"RETURN ID(user) AS invitee_id, inviter.first_name AS inviter_name, " + User::InvitedUser.invited_info + " "
	end
end