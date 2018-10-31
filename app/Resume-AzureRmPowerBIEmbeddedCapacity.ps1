switch((get-date).DayOfWeek)
{
 {'Monday','Tuesday','Wednesday','Thursday','Friday' -contains  $_} 
 
 {
    $azureAccountName ="58102a85-c3ee-47c4-aa09-4438dc54cf6f"
    $azurePassword = ConvertTo-SecureString "Qw#92245627" -AsPlainText -Force
    $psCred = New-Object System.Management.Automation.PSCredential($azureAccountName, $azurePassword)
    Login-AzureRmAccount -Credential $psCred -ServicePrincipal -TenantId cf8717b1-5a74-45ff-9bab-33499c6ca1a3 -Subscription 6dc5b95f-9890-48e4-83e1-d2cf734dc8b3
    Resume-AzureRmPowerBIEmbeddedCapacity -Name madhouse -ResourceGroupName madhouse-powerbi
 }

}
