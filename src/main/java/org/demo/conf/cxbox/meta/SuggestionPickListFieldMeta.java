package org.demo.conf.cxbox.meta;


import java.util.Map;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.cxbox.core.ui.field.CxboxWidgetField;
import org.cxbox.core.ui.model.json.field.FieldMeta.FieldMetaBase;

@Data
@EqualsAndHashCode(callSuper = true)
@CxboxWidgetField({"suggestionPickList"})
public class SuggestionPickListFieldMeta extends FieldMetaBase {

	private String popupBcName;

	private Map<String, String> pickMap;

}
