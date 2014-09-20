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
    if params[:friend][:email]
      mandrill_mail template: params[:template],
                    subject: params[:user][:name]+" recommended you a book at Reader's Door",
                    to: { email: params[:friend][:email]},
                    vars: {
                      'ISBN' => params[:book][:isbn],
                      'TITLE' => params[:book][:title],
                      'AUTHOR_NAME' => params[:book][:author_name],
                      'BOOK_ID' => params[:book][:id],
                      'FRIEND_NAME' => params[:friend][:name],
                      'USERNAME' => params[:user][:name],
                      'THUMB' => params[:user][:thumb],
                      'USER_ID' => params[:user][:id]
                    },
                    important: true,
                    inline_css: true
    end
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