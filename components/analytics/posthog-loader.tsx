'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { getConsentStatus } from '@/components/ui/cookie-consent'

export function PostHogLoader() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const status = getConsentStatus()
    // Load if accepted or if user hasn't made a choice yet (pending)
    // Only block if explicitly declined
    if (status !== 'declined') {
      setShouldLoad(true)
    }
  }, [])

  if (!shouldLoad) return null

  return (
    <Script id='posthog-analytics' strategy='afterInteractive'>
      {`
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init Te Ds js Re Os As capture Ke calculateEventProperties zs register register_once register_for_session unregister unregister_for_session Hs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty qs Ns createPersonProfile Bs Cs Ws opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Ls debug L Us getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('phc_pl9FJOL4Yl6EdZy3zwvQ6d8sM7N6npOa5NtJLBdYElJ', {
            api_host: 'https://us.i.posthog.com',
            defaults: '2025-05-24',
            person_profiles: 'identified_only',
        });
      `}
    </Script>
  )
}
