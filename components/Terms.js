// components/Terms.js
import React from 'react';
import './Terms.css'; // We'll create the CSS file next

const Terms = () => {
  // Data array for the 12 terms - content adapted from your document
  const termsData = [
    {
      id: 1,
      emoji: '🪪',
      title: 'Eligibility & Age Verification',
      desc: 'Participants must be 18 years or older at application. Valid government-issued ID required for final selection. Must be legally able to reside and travel within Nigeria for the 3-week filming. No felony convictions or pending criminal cases. Must be single, divorced, or legally separated (no current marital commitments). Not currently in a serious, exclusive relationship that would conflict with show format.'
    },
    {
      id: 2,
      emoji: '🎥',
      title: 'Consent to Film & Broadcast',
      desc: 'You grant Celebrity Star Africa irrevocable rights to film, record, and photograph you 24/7 during production. The show contains adult content including romantic situations, intimate conversations, and mature themes. Footage may be used in perpetuity across all media platforms worldwide (broadcast, streaming, social media, promotional materials). No additional compensation beyond Winner\'s prize and gifts. You waive the right to inspect or approve final content. Production may use your name, likeness, voice, and biographical information for promotional purposes.'
    },
    {
      id: 3,
      emoji: '🧠',
      title: 'Psychological & Emotional Considerations',
      desc: 'Participants must be mentally and emotionally prepared for reality TV pressures. Psychological evaluation required before final selection (at production\'s expense). The show involves emotional situations, potential conflict, and public scrutiny. Production may remove participants whose mental health is at risk. Production shall not be held liable for any mental health issues or emotional harm arising from participation. You acknowledge that online harassment and media attention are possible during and after broadcast.'
    },
    {
      id: 4,
      emoji: '🤫',
      title: 'Confidentiality & Non-Disclosure',
      desc: 'Comprehensive NDA must be signed upon Candidate arrival at the show mansion.'
    },
    {
      id: 5,
      emoji: '📱',
      title: 'Social Media & Public Conduct',
      desc: 'Celebrity Star Africa is not responsible for online harassment or media scrutiny. You may be required to participate in show promotional activities on your social channels.'
    },
    {
      id: 6,
      emoji: '🔍',
      title: 'Background Verification',
      desc: 'All finalists consent to comprehensive background check (criminal, employment, social media). Previous reality TV appearances must be disclosed. Production may utilise external events surrounding the candidate for the purpose of the show.'
    },
    {
      id: 7,
      emoji: '🏥',
      title: 'Medical & Physical Requirements',
      desc: 'Activities may include physical challenges and long filming hours. Production provides emergency medical care but is not liable for pre-existing conditions. You consent to emergency medical treatment if necessary. Must disclose any medical conditions that could affect participation.'
    },
    {
      id: 8,
      emoji: '🚫',
      title: 'Substance Use Policy',
      desc: 'No hard drug use permitted during filming. Prescription medications must be disclosed to production if needed. Smoking/vaping restricted to designated areas and times.'
    },
    {
      id: 9,
      emoji: '❤️',
      title: 'Romantic Relationships & Conduct',
      desc: 'Relationships formed during the show may be portrayed for entertainment. Participants must respect boundaries and consent at all times. Physical harassment may attract immediate expulsion. Production may intervene in situations compromising safety. Intimate moments may be filmed and broadcast.'
    },
    {
      id: 10,
      emoji: '📅',
      title: 'Post-Show Obligations',
      desc: 'Selected participants may be required for promotional activities (interviews, events, social media). Exclusive media rights apply for 12 months after broadcast. Cannot participate in competing reality shows for 12 months. Must maintain confidentiality about unaired content.'
    },
    {
      id: 11,
      emoji: '⚖️',
      title: 'Disclaimer of Liability',
      desc: 'Celebrity Star Africa is not liable for emotional distress, reputation damage, or other participation consequences. You assume all risks associated with public exposure and media portrayal. Show\'s portrayal at sole discretion of producers and editors. No guarantee of airtime or specific portrayal.'
    },
    {
      id: 12,
      emoji: '💰',
      title: 'Compensation & Expenses',
      desc: 'Accommodation, meals, and refreshments provided during production. Consolation prizes for runner-ups shall rest on the discretion of producers. The winner\'s prize is $35,000 USD worth of prizes, awarded as producers determine. Half of gifts accumulated by participants during filming shall be given to the candidate at the end of the show season; half is retained by Celebrity Star Africa. Travel to filming location from the mansion during production at producer\'s expense unless otherwise agreed.'
    }
  ];

  return (
    <div className="terms-container">
      {/* Header with brand and prize */}
      <div className="terms-header">
        <h1 className="brand-title">🌟 CELEBRITY STAR AFRICA</h1>
        <div className="prize-badge">
          <span className="prize-label">WINNER</span> $35,000 USD
        </div>
      </div>

      {/* Prominent 18+ warning */}
      <div className="age-warning">
        <span className="age-icon">🔞</span>
        <span className="age-text">
          YOU MUST BE 18 YEARS OR OLDER TO PARTICIPATE · Valid government ID required upon selection. No exceptions.
        </span>
      </div>

      {/* Grid of 12 term cards */}
      <div className="terms-grid">
        {termsData.map((term) => (
          <div key={term.id} className="term-card">
            <div className="term-number">#{term.id.toString().padStart(2, '0')}</div>
            <div className="term-title">
              <span className="term-emoji">{term.emoji}</span> {term.title}
            </div>
            <div className="term-description">{term.desc}</div>
          </div>
        ))}
      </div>

      {/* Footer summary and legal reminders */}
      <div className="terms-footer">
        <div className="footer-highlight">
          <span className="footer-icon">📋</span> Valid government ID mandatory
        </div>
        <div className="footer-highlight">
          <span className="footer-icon">🧪</span> Psychological evaluation (paid by production)
        </div>
        <div className="footer-highlight">
          <span className="footer-icon">🏆</span> Grand prize $35,000 USD + gifts (50% retained by Celebrity Star Africa)
        </div>
      </div>

      {/* Additional disclaimer line */}
      <p className="disclaimer-note">
        ⚖️ Celebrity Star Africa is not liable for emotional distress, reputation damage, or other consequences.
        You waive right to inspect final content. All risks assumed. NDA signed upon arrival.
      </p>
    </div>
  );
};

export default Terms;