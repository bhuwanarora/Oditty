class SubscriptionMailer < MandrillMailer::TemplateMailer
  default from: 'developers@readersdoor.com'

  def invite(invitation='Coming Soon')
    mandrill_mail template: invitation[:template],
                  subject: 'Welcome To Reader\'s Door',
                  to: { email: invitation[:email], name: invitation[:name] },
                  vars: {
                    'USERNAME' => invitation[:name]
                  },
                  important: true,
                  inline_css: true
  end

  def webhooks params
    subject = params[:params][:commits][0][:message] + ' : ' + params[:params][:pusher][:name] rescue ""
    mandrill_mail template: params[:template] ,
                  subject: ('Github ' + subject),
                  to: {email: params[:email]},
                  vars: {
                    'USERNAME' => params[:params][:pusher][:name],
                    'EMAIL' => params[:params][:pusher][:email],
                    'MESSAGE' => params[:params][:commits][0][:message],
                    'TIMESTAMP' => params[:params][:commits][0][:timestamp],
                    'REPOSITORY' => params[:params][:repository][:full_name],
                    'LINK' => params[:params][:commits][0][:url],
                    'BRANCH' => params[:params][:ref]
                  },
                  important: true,
                  inline_css: true
  end

  def follow params
    mandrill_mail template: params[:follow_template],
                  subject: params[:friend][:name] + " started following you at ReadersDoor.",
                  to: { email: params[:user][:email]},
                  vars: {
                    'USERNAME' => params[:user][:name],
                    'FRIENDNAME' => params[:friend][:name]
                    'FRIENDID'  => params[:friend][:id]
                  },
                  important: true,
                  inline_css: true
  end

  def news_subscription params
    mandrill_mail template: params[:template],
                  subject: params[:news1][:title],
                  to: { email: "prachi@readersdoor.com"},
                  vars: {
                     'NEWS1_TITLE' =>         params[:news1][:title],
                     'NEWS2_TITLE' =>         params[:news2][:title],
                     'NEWS3_TITLE' =>         params[:news3][:title],
                     'NEWS4_TITLE' =>         params[:news4][:title],
                     'NEWS1_DESCRIPTION' =>   params[:news1][:description],
                     'NEWS2_DESCRIPTION' =>   params[:news2][:description],
                     'NEWS3_DESCRIPTION' =>   params[:news3][:description],
                     'NEWS4_DESCRIPTION' =>   params[:news4][:description],
                     'NEWS1_URL' =>           params[:news1][:url],
                     'NEWS2_URL' =>           params[:news2][:url],
                     'NEWS3_URL' =>           params[:news3][:url],
                     'NEWS4_URL' =>           params[:news4][:url],
                     'NEWS1_IMAGE_URL' =>     params[:news1][:image_url],
                     'NEWS2_IMAGE_URL' =>     params[:news2][:image_url],
                     'NEWS3_IMAGE_URL' =>     params[:news3][:image_url],
                     'NEWS4_IMAGE_URL' =>     params[:news4][:image_url],
                     'NEWS1_ID' =>            params[:news1][:id],
                     'NEWS2_ID' =>            params[:news2][:id],
                     'NEWS3_ID' =>            params[:news3][:id],
                     'NEWS4_ID' =>            params[:news4][:id],
                     'NEWS1_COMMUNITY1_ID' => params[:news1][:community1][:id],
                     'NEWS1_COMMUNITY2_ID' => params[:news1][:community2][:id],
                     'NEWS2_COMMUNITY1_ID' => params[:news2][:community1][:id],
                     'NEWS2_COMMUNITY2_ID' => params[:news2][:community2][:id],
                     'NEWS3_COMMUNITY1_ID' => params[:news3][:community1][:id],
                     'NEWS3_COMMUNITY2_ID' => params[:news3][:community2][:id],
                     'NEWS4_COMMUNITY1_ID' => params[:news4][:community1][:id],
                     'NEWS4_COMMUNITY2_ID' => params[:news4][:community2][:id],
                     'NEWS1_COMMUNITY1_NAME' => params[:news1][:community1][:name],
                     'NEWS1_COMMUNITY2_NAME' => params[:news1][:community2][:name],
                     'NEWS2_COMMUNITY1_NAME' => params[:news2][:community1][:name],
                     'NEWS2_COMMUNITY2_NAME' => params[:news2][:community2][:name],
                     'NEWS3_COMMUNITY1_NAME' => params[:news3][:community1][:name],
                     'NEWS3_COMMUNITY2_NAME' => params[:news3][:community2][:name],
                     'NEWS4_COMMUNITY1_NAME' => params[:news4][:community1][:name],
                     'NEWS4_COMMUNITY2_NAME' =>      params[:news4][:community2][:name],
                     'NEWS1_COMMUNITY1_IMAGE_URL' => params[:news1][:community1][:image_url],
                     'NEWS1_COMMUNITY2_IMAGE_URL' => params[:news1][:community2][:image_url],
                     'NEWS2_COMMUNITY1_IMAGE_URL' => params[:news2][:community1][:image_url],
                     'NEWS2_COMMUNITY2_IMAGE_URL' => params[:news2][:community2][:image_url],
                     'NEWS3_COMMUNITY1_IMAGE_URL' => params[:news3][:community1][:image_url],
                     'NEWS3_COMMUNITY2_IMAGE_URL' => params[:news3][:community2][:image_url],
                     'NEWS4_COMMUNITY1_IMAGE_URL' => params[:news4][:community1][:image_url],
                     'NEWS4_COMMUNITY2_IMAGE_URL' => params[:news4][:community2][:image_url]
                  },
                  # from: "recommendbooks@readersdoor.com",
                  important: true,
                  inline_css: true
  end

  def subscribe(invitation)
    mandrill_mail template: invitation[:template],
                  subject: 'Welcome To Reader\'s Door',
                  to: { email: invitation[:email], name: invitation[:name] },
                  vars: {
                    'USERNAME' => invitation[:name]
                  },
                  important: true,
                  inline_css: true
  end

  def verify_email(invitation)
    mandrill_mail template: invitation[:template],
                  subject: 'Verify Email: Reader\'s Door',
                  to: { email: invitation[:email] },
                  vars: {
                    'LINK' => invitation[:link]
                  },
                  important: true,
                  inline_css: true
  end

  def recommend_book params
    mandrill_mail template: params[:template],
                  subject: params[:user][:name]+" recommends you to read " + params[:book][:title],
                  to: { email: params[:friend][:email]},
                  vars: {
                    'ISBN' => params[:book][:isbn],
                    'TITLE' => params[:book][:title],
                    'AUTHOR_NAME' => params[:book][:author_name],
                    'BOOK_ID' => params[:book][:id],
                    'FRIEND_NAME' => params[:friend][:name],
                    'USERNAME' => params[:user][:name],
                    'THUMB' => params[:user][:image_url],
                    'USER_ID' => params[:user][:id]
                  },
                  # from: "recommendbooks@readersdoor.com",
                  important: true,
                  inline_css: true
  end

  def recover_password invitation
    mandrill_mail template: invitation[:template],
                  subject: 'Recover Password: Reader\'s Door',
                  to: { email: invitation[:email] },
                  vars: {
                    'LINK' => invitation[:link]
                  },
                  important: true,
                  inline_css: true
  end

  def test_email
    mandrill_mail template: "TestEmail",
                  subject: 'TEST EMAIL',
                  to: { email: "bhuwanarora67@gmail.com" },
                  important: true,
                  inline_css: true 
  end
end