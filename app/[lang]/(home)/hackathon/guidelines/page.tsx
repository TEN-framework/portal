export default function GuidelinesPage() {
  return (
    <section className='mt-12 bg-white py-16 md:mt-16 dark:bg-gray-950'>
      <div className='container mx-auto max-w-[72rem] px-6'>
        <h1 className='mb-6 font-bold text-3xl text-gray-900 md:text-4xl dark:text-white'>
          TEN DEV Challenge – Participant Guidelines
        </h1>

        <div className='prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200'>
          <h2 className='mt-8 font-semibold text-xl'>
            1. Agreeing to the Rules
          </h2>
          <p>
            By registering for and/or submitting your project, you confirm that
            you understand and agree to follow these official guidelines.
          </p>

          <hr className='my-6 border-gray-200 dark:border-gray-800' />

          <h2 className='mt-8 font-semibold text-xl'>2. Your Submission</h2>
          <ul className='list-disc pl-6'>
            <li>
              Your entry must be original and created by you or your team.
            </li>
            <li>
              You must own all parts of your submission, and it must not
              infringe on others’ rights (copyright, trade secrets, privacy,
              publicity, etc.).
            </li>
            <li>
              Previous TEN event winners cannot submit the same project
              again—but significantly updated or upgraded versions are allowed.
            </li>
            <li>
              By entering a Submission on behalf of a team, you represent and
              warrant that you are the Representative authorized to act on
              behalf of your team and that all team members have read and agreed
              to these official guidelines.
            </li>
          </ul>

          <hr className='my-6 border-gray-200 dark:border-gray-800' />

          <h2 className='mt-8 font-semibold text-xl'>
            3. Intellectual Property &amp; Promotion
          </h2>
          <ul className='list-disc pl-6'>
            <li>
              By participating, you give TEN Framework and partners the right to
              promote your project, including using names, photos, voices, and
              images of contributors in event-related materials, during the
              hackathon and for up to three years after.
            </li>
            <li>Some project components may be publicly displayed.</li>
          </ul>

          <hr className='my-6 border-gray-200 dark:border-gray-800' />

          <h2 className='mt-8 font-semibold text-xl'>4. Personal Data</h2>
          <ul className='list-disc pl-6'>
            <li>
              By entering, you acknowledge and agree that the personal data you
              provide (e.g., name, email address, project details) will be
              collected, processed, and used by TEN Framework and its authorized
              partners for the purposes of administering and promoting this
              Competition. Your personal data may be transferred to and
              processed in countries outside your country of residence, which
              may have different data protection rules.
            </li>
            <li>
              You have the right to access, rectify, erase, and restrict the
              processing of your personal data, as well as the right to data
              portability and to withdraw consent. You can exercise these rights
              by contacting us at
              <a className='ml-1 underline' href='mailto:developer@theten.ai'>
                developer@theten.ai
              </a>
              .
            </li>
          </ul>

          <hr className='my-6 border-gray-200 dark:border-gray-800' />

          <h2 className='mt-8 font-semibold text-xl'>5. Prizes Delivery</h2>
          <ul className='list-disc pl-6'>
            <li>
              Prizes may not be awarded if no eligible submissions meet the
              criteria.
            </li>
            <li>
              Distribution:
              <ul className='mt-2 list-disc pl-6'>
                <li>
                  Prizes will be awarded directly to the Entrant if the
                  submission is from an individual.
                </li>
                <li>
                  For team submissions, prizes will be awarded to the team’s
                  authorized representative. It is then the responsibility of
                  that representative to distribute the prize fairly among all
                  participating team or organization members, according to their
                  own discretion.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
