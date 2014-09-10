module S3WebsiteHelper
	def self.s3_access_token bucket
		@bucket = bucket
      	info = {
        	policy:    s3_upload_policy,
        	signature: s3_upload_signature,
        	key:       'AKIAIYBNZW7EXNRWZOYQ'
      	}
      	info
    end

    protected

  	def s3_upload_policy
    	@policy ||= create_s3_upload_policy
  	end

    def create_s3_upload_policy
        Base64.encode64(
          {
            "expiration" => 1.hour.from_now.utc.xmlschema,
            "conditions" => [ 
              { "bucket" =>  @bucket },
              [ "starts-with", "$key", "" ],
              { "acl" => "public-read" },
              [ "starts-with", "$Content-Type", "" ],
              [ "content-length-range", 0, 10 * 1024 * 1024 ]
            ]
          }.to_json).gsub(/\n/,'')
    end

    def s3_upload_signature
        Base64.encode64(OpenSSL::HMAC.digest(OpenSSL::Digest::Digest.new('sha1'), GLOBAL[:aws_secret], s3_upload_policy)).gsub("\n","")
    end
end