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
                  subject: 'Reader\'s Door: Verify Email',
                  to: { email: invitation[:email] },
                  vars: {
                    'LINK' => invitation[:link]
                  },
                  important: true,
                  inline_css: true
  end

  def recover_password invitation
    mandrill_mail template: invitation[:template],
                  subject: 'Reader\'s Door: Recover Password',
                  to: { email: invitation[:email] },
                  vars: {
                    'LINK' => invitation[:link]
                  },
                  important: true,
                  inline_css: true
  end
end