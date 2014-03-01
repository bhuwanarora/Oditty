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
end