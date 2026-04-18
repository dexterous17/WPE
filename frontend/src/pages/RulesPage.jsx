import { Link } from 'react-router-dom'
import ContentPage from '../components/ContentPage'

export default function RulesPage() {
  return (
    <ContentPage title="Rules">
      <h2>I. Preliminary rules (subject to change)</h2>
      <p>
        All participants together build the General Assembly (GA), the most important
        decision-making body of the WPE. All participants have the right to submit petitions
        concerning any aspect of the WPE (contents, procedures, persons). There is a list of all
        petitions in the &quot;future votes&quot; section. Each participant is asked to nominate
        petitions during the week for next week&apos;s &quot;current votes&quot; section. The top
        10 petitions will be subject to a GA vote the following week. Votes are accepted if a
        simple majority votes in favor of a petition. All petitions must be structured in a
        &quot;yes&quot; or &quot;no&quot; format.
      </p>
      <p>
        Participants can delegate their votes to representatives and take it back at any time.
        They have three options: No delegation, delegation to a single person for all categories
        and delegation to a single person for a single category. If participants delegate their
        vote and do not vote themselves, the delegate uses the vote.
      </p>
      <p>
        The discussions serve to organize the opinion-building process before a vote takes place.
        Discussions may concern any subject; they are related to certain categories and to the
        petitions posted in the &quot;future votes&quot; section. New categories may be opened at
        any time on the main page. The discussion of regional topics is encouraged as a preparation
        for future &quot;regional democracy experiments&quot; (RDE) as a part of the WPE.
      </p>
      <p>
        The program is the result of the WPE discussions and votes. Successful votes (except
        those related to electing officials) directly build the WPE program structured by
        categories. The WPE speaker and government shall promote and implement this program.
      </p>
      <p>
        The administration helps and consults the World Parliament Experiment e. V. in the conduct
        of the WPE. Involvement of the WPE participants in the administration is encouraged.
      </p>

      <h2>II. Basic rules (cannot be changed)</h2>
      <p>
        1. All participants of the WPE have the right to submit petitions relating to any subject
        as long as these petitions do not violate basic principles of democracy. There will be a
        vote on petitions if they gather the pre-established amount of support (see I., 1.).
      </p>
      <p>
        2. The World Parliament Experiment e. V. is free to decide what it considers to be
        necessary for the WPE until 100,000 active members participate at least a month in a WPE
        vote. After 100,000 members participate in the WPE, the World Parliament Experiment e. V. is
        expected to change its statute accordingly.
      </p>
      <p>
        3. The participants have the right to change all rules of the WPE (except II, 1. and II,
        2.), if there is a majority for a specific proposal.
      </p>

      <h2>Voting rhythm</h2>
      <p>
        Future votes can collect support until each Sunday 7 p.m. CET; successful ones will be on
        the list of 10 current votes for one week. The collection phase for future votes can be
        longer than one week (to be determined by the proponent).
      </p>
      <p>As long as the beta test is running the voting rhythm has been accelerated (daily instead of weekly).</p>
      <p>
        For more information about the decision-making procedure please see the{' '}
        <Link to="/faq">FAQ</Link> section of this website.
      </p>
    </ContentPage>
  )
}
